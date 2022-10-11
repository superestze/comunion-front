import { UAddress, UButton, UCard, UInputNumberGroup, UModal, UTooltip } from '@comunion/components'
import { ExchangeOutlined, QuestionFilled } from '@comunion/icons'
import dayjs from 'dayjs'
import { BigNumber, Contract, ethers } from 'ethers'
import { defineComponent, computed, PropType, ref, onMounted, watch } from 'vue'
import { CoinType } from '../[id]'
import { CrowdfundingStatus } from '../utils'
import CoinIcon from '@/components/CoinIcon'
import { useErc20Contract, useCrowdfundingContract } from '@/contracts'
import { ServiceReturn, services } from '@/services'
import { useUserStore, useWalletStore } from '@/stores'
import { useContractStore } from '@/stores/contract'
import { getChainInfoByChainId } from '@/utils/etherscan'
import { formatToFloor } from '@/utils/numberFormat'
import './invest.css'

export const renderUnit = (symbol: string) => {
  return (
    <div
      class={[
        'u-h5 flex justify-center items-center border rounded-r-sm bg-purple w-30',
        { 'text-color1': symbol, 'text-color3': !symbol }
      ]}
    >
      <CoinIcon symbol={symbol} class="h-4 mr-2 w-4" />
      <span>{symbol || 'Token'}</span>
    </div>
  )
}

export const Invest = defineComponent({
  name: 'Invest',
  props: {
    info: {
      type: Object as PropType<NonNullable<ServiceReturn<'crowdfunding@detail'>>>,
      required: true
    },
    buyCoinInfo: {
      type: Object as PropType<CoinType>,
      required: true
    },
    sellCoinInfo: {
      type: Object as PropType<CoinType>,
      required: true
    }
  },
  emits: ['refreshCoin', 'refreshData'],
  setup(props, ctx) {
    const walletStore = useWalletStore()
    const userStore = useUserStore()
    const contractStore = useContractStore()
    const cancelModal = ref(false)
    const removeModal = ref(false)
    const fromValue = ref<string>('')
    const toValue = ref<string>('')
    const raiseState = ref({
      raiseAmount: 0,
      raiseGoal: 0,
      raisePercent: 0,
      swapAmount: 0
    })

    const fundingContractStateSecound = ref()
    const fundingContract = useCrowdfundingContract({
      chainId: walletStore.chainId!,
      addresses: { [walletStore.chainId!]: props.info.crowdfundingContract }
    })
    const maxBuy = ref<number | string>(0)
    const maxSell = ref<number | string>(0)
    const mode = ref<'buy' | 'sell'>('buy')
    const tokenContract = useErc20Contract()

    const chainInfo = getChainInfoByChainId(props.info.chainId)

    const getMin = (first: number | string, second: number | string) => {
      return ethers.FixedNumber.from(first).subUnsafe(ethers.FixedNumber.from(second)).isNegative()
        ? first
        : second
    }

    const getBuyCoinDecimal = () => {
      return buyIsMainCoin.value ? 18 : props.buyCoinInfo.decimal!
    }

    const maxBuyAmount = computed(() => {
      const decimal = getBuyCoinDecimal()
      return (
        formatToFloor(
          getMin(maxBuy.value || 0, props.buyCoinInfo.balance || 0).toString(),
          decimal
        ) || '0'
      )
    })

    const maxSellAmount = computed(() => {
      return (
        formatToFloor(
          getMin(maxSell.value || 0, props.sellCoinInfo.balance || 0).toString(),
          props.sellCoinInfo.decimal!
        ) || '0'
      )
    })

    watch(
      () => fromValue.value,
      value => {
        changeFromValue(value)
      }
    )

    watch(
      () => toValue.value,
      value => {
        changeToValue(value)
      }
    )

    const changeFromValue = (value: string) => {
      if (Number(value) === 0) toValue.value = '0'
      if (!value) return
      if (mode.value === 'buy') {
        toValue.value = formatToFloor(
          ethers.FixedNumber.from(value)
            .mulUnsafe(ethers.FixedNumber.from(props.info.buyPrice))
            .toString(),
          props.sellCoinInfo.decimal!
        )
      } else {
        toValue.value = formatToFloor(
          ethers.FixedNumber.from(value)
            .divUnsafe(ethers.FixedNumber.from(props.info.buyPrice))
            .toString(),
          buyIsMainCoin.value ? 18 : props.buyCoinInfo.decimal!
        )
      }
    }

    const changeToValue = (value: string) => {
      if (Number(value) === 0) fromValue.value = '0'
      if (!value) return
      console.log('changeToValue value===>', value)
      if (mode.value === 'buy') {
        fromValue.value = formatToFloor(
          ethers.FixedNumber.from(value)
            .divUnsafe(ethers.FixedNumber.from(props.info.buyPrice))
            .toString(),
          buyIsMainCoin.value ? 18 : props.buyCoinInfo.decimal!
        )
      } else {
        fromValue.value = formatToFloor(
          ethers.FixedNumber.from(value)
            .mulUnsafe(ethers.FixedNumber.from(props.info.buyPrice))
            .toString(),
          props.sellCoinInfo.decimal!
        )
      }
    }

    const addInvestRecord = async (txHash: string, access: 1 | 2) => {
      await services['crowdfunding@invest-crowdfunding']({
        crowdfundingId: props.info.crowdfundingId,
        txHash,
        access,
        buyTokenSymbol: props.buyCoinInfo.symbol!,
        buyTokenAmount: mode.value === 'buy' ? Number(fromValue.value) : Number(toValue.value),
        sellTokenSymbol: props.sellCoinInfo.symbol!,
        sellTokenAmount: mode.value === 'buy' ? Number(toValue.value) : Number(fromValue.value),
        price: Number(props.info.buyPrice)
      })
    }

    const buyIsMainCoin = computed(() => {
      return props.info.sellTokenContract === props.info.buyTokenContract
    })

    const changeMode = () => {
      if (mode.value === 'buy') {
        mode.value = 'sell'
      } else {
        mode.value = 'buy'
      }
    }

    const countDownTime = computed(() => {
      const countDown = {
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00'
      }

      const numberClass = 'u-h4 rounded-sm px-1 min-w-10 text-center py-2'

      if (props.info.status === CrowdfundingStatus.CANCELED) {
        return {
          status: CrowdfundingStatus.CANCELED,
          label: 'Cancelled',
          value: countDown,
          class: `${numberClass} bg-[rgba(245,246,250,1)] text-black text-opacity-10`
        }
      }

      const dateNow = ref<dayjs.Dayjs>(dayjs.utc())

      const timer: any = () => {
        dateNow.value = dayjs.utc()
        if (dateNow.value.isAfter(dayjs(props.info.endTime).utc())) {
          return null
        }
        return setTimeout(timer, 1000)
      }
      // before start
      if (dateNow.value.isBefore(dayjs(props.info.startTime).utc())) {
        timer()
        const [days, hours, minutes, seconds] = dayjs
          .duration(dayjs(props.info.startTime).utc().diff(dateNow.value))
          .format('DD-HH-mm-ss')
          .split('-')
        return {
          status: CrowdfundingStatus.UPCOMING,
          label: 'dCrowdfunding Starts In',
          value: {
            days,
            hours,
            minutes,
            seconds
          },
          class: `${numberClass} bg-[rgba(83,49,244,0.06)] text-primary`
        }
      }

      // ended
      if (dateNow.value.isAfter(dayjs(props.info.endTime).utc())) {
        return {
          status: CrowdfundingStatus.ENDED,
          label: 'dCrowdfunding Has Ended',
          value: countDown,
          class: `${numberClass} bg-[rgba(242,159,57,0.06)] text-warning`
        }
      }

      // after start and before end
      timer()
      const diffDuration = dayjs
        .duration(dayjs(props.info.endTime).utc().diff(dateNow.value))
        .format('DD-HH-mm-ss')
        .split('-')

      const [days, hours, minutes, seconds] = diffDuration
      return {
        status: CrowdfundingStatus.LIVE,
        label: 'dCrowdfunding Ends In',
        value: {
          days,
          hours,
          minutes,
          seconds
        },
        class: `${numberClass} bg-[rgba(83,49,244,0.06)] text-primary`
      }
    })

    const founderOperation = computed(() => {
      return countDownTime.value.status === CrowdfundingStatus.ENDED ? 'Remove' : 'Cancel'
    })

    const disableRemoveOrCancel = computed(() => {
      if (founderOperation.value === 'Remove') {
        return fundingContractStateSecound.value?.[9] === CrowdfundingStatus.ENDED
      } else {
        return countDownTime.value.status !== CrowdfundingStatus.UPCOMING
      }
    })

    const disableRemoveOrCancelReason = computed(() => {
      let reason = ''
      if (disableRemoveOrCancel.value) {
        if (founderOperation.value !== 'Remove') {
          reason = 'This dCrowdfunding cannot be cancelled when it is in living.'
        }
      }

      return reason
    })

    const removeCrowdfunding = async () => {
      try {
        removeModal.value = false
        const pendingText = 'Waiting to submit all contents to blockchain for removing'
        const waitingText = 'Waiting to confirm.'
        const contractRes: any = await fundingContract.remove(pendingText, waitingText)
        await services['crowdfunding@remove-crowdfunding']({
          crowdfundingId: props.info.crowdfundingId,
          txHash: contractRes.hash
        })
        fundingContractStateSecound.value = false
        // refresh date
        ctx.emit('refreshData')
      } catch (error) {
        console.log('error', error)
        contractStore.endContract('failed', { success: false })
      }
    }

    const cancelCrowdfunding = async () => {
      cancelModal.value = false
      const pendingText = 'Waiting to submit all contents to blockchain for canceling'
      const waitingText = 'Waiting to confirm.'
      // Contract
      const contractRes: any = await fundingContract.cancel(pendingText, waitingText)
      // api
      if (contractRes && contractRes.hash) {
        services['crowdfunding@cancel-crowdfunding']({
          crowdfundingId: props.info.crowdfundingId,
          txHash: contractRes.hash
        })
          .then(() => {
            ctx.emit('refreshData')
          })
          .catch(() => {
            contractStore.endContract('failed', { success: false })
          })
      }
    }

    const netWorkChange = async (value: number) => {
      if (walletStore.chainId !== value) {
        await walletStore.ensureWalletConnected()
        const result = await walletStore.wallet?.switchNetwork(value)
        if (!result) {
          return false
        }
        return true
      }
      return true
    }
    const removeOrCancel = async () => {
      try {
        const changeChain = await netWorkChange(props.info.chainId)
        if (!changeChain) return
        if (founderOperation.value === 'Remove') {
          removeModal.value = true
        } else {
          cancelModal.value = true
        }
      } catch (error) {
        console.log('error', error)
      }
    }

    const buyFromMainCoin = async (sellAmount: number | BigNumber) => {
      const buyPendingText = 'The transaction of buying is processing.'
      const waitingText = 'Waiting to confirm.'
      try {
        console.log('fromValue.value==>', fromValue.value)

        const buyAmount = ethers.utils.parseEther(fromValue.value)

        console.log('submit', buyAmount, sellAmount)
        // main coin buy token
        const contractRes: any = await fundingContract.buy(
          buyAmount,
          sellAmount,
          buyPendingText,
          waitingText,
          {
            value: ethers.utils.parseEther(fromValue.value)
          }
        )
        if (contractRes && contractRes.hash) {
          await addInvestRecord(contractRes.hash, 1)
        }
      } catch (error) {
        console.log('error===>', error)
      }
    }

    const buyFromTokenCoin = async (sellAmount: number | BigNumber) => {
      try {
        const buyPendingText = 'The transaction of buying is processing.'
        const waitingText = 'Waiting to confirm.'
        const approvePendingText = 'The transaction of buying is processing.'
        const buyAmount = ethers.utils.parseUnits(fromValue.value)
        contractStore.startContract(approvePendingText)
        const buyTokenRes = await tokenContract(props.info.buyTokenContract)
        const decimal = await buyTokenRes.decimals()
        const approveRes: Contract = await buyTokenRes.approve(
          props.info.crowdfundingContract,
          ethers.utils.parseUnits(fromValue.value.toString(), decimal)
        )
        await approveRes.wait()

        const contractRes: any = await fundingContract.buy(
          buyAmount,
          sellAmount,
          buyPendingText,
          waitingText
        )

        if (contractRes && contractRes.hash) {
          await addInvestRecord(contractRes.hash, 1)
        }
      } catch (error) {
        console.error(error)
        contractStore.endContract('failed', { success: false })
      }
    }

    const sellToMainCoin = async () => {
      try {
        const fromAmount = ethers.utils.parseUnits(fromValue.value, props.sellCoinInfo.decimal!)
        const toAmount = ethers.utils.parseUnits(toValue.value)
        const sellPendingText = 'The selling transaction is processing.'
        const waitingText = 'Waiting to confirm.'
        const approvePendingText = 'The transaction of selling is processing.'
        contractStore.startContract(approvePendingText)

        const sellTokenRes = tokenContract(props.info.sellTokenContract)

        const approveRes: Contract = await sellTokenRes.approve(
          props.info.crowdfundingContract,
          fromAmount
        )
        await approveRes.wait()
        const contractRes: any = await fundingContract.sell(
          toAmount,
          fromAmount,
          sellPendingText,
          waitingText
        )

        if (contractRes && contractRes.hash) {
          await addInvestRecord(contractRes.hash, 2)
        }
      } catch (error) {
        console.error('error', error)
        contractStore.endContract('failed', { success: false })
      }
    }

    const sellToTokenCoin = async () => {
      try {
        const fromAmount = ethers.utils.parseUnits(fromValue.value, props.sellCoinInfo.decimal!)

        const sellPendingText = 'The selling transaction is processing.'
        const waitingText = 'Waiting to confirm.'

        const approvePendingText = 'The transaction of selling is processing.'
        contractStore.startContract(approvePendingText)
        const sellTokenRes = tokenContract(props.info.sellTokenContract)
        const approveRes: Contract = await sellTokenRes.approve(
          props.info.crowdfundingContract,
          fromAmount
        )
        await approveRes.wait()

        const toAmount = ethers.utils.parseUnits(toValue.value, props.buyCoinInfo.decimal)

        const contractRes: any = await fundingContract.sell(
          toAmount,
          fromAmount,
          sellPendingText,
          waitingText
        )

        if (contractRes && contractRes.hash) {
          await addInvestRecord(contractRes.hash, 2)
        }
      } catch (error) {
        console.error('error', error)
        contractStore.endContract('failed', { success: false })
      }
    }

    const buyOrSell = async () => {
      const changeChain = await netWorkChange(props.info.chainId)
      if (!changeChain) return
      if (mode.value === 'buy') {
        const sellAmount = ethers.utils.parseUnits(toValue.value)
        if (buyIsMainCoin.value) {
          await buyFromMainCoin(sellAmount)
        } else {
          // other coin buy
          await buyFromTokenCoin(sellAmount)
        }
      } else {
        if (buyIsMainCoin.value) {
          await sellToMainCoin()
        } else {
          await sellToTokenCoin()
        }
      }
      initPage()
    }

    const disabledBuyOrSell = computed(() => {
      return (
        countDownTime.value.status !== CrowdfundingStatus.LIVE ||
        Number(fromValue.value) <= 0 ||
        (mode.value === 'buy' && raiseState.value.raisePercent >= 100) ||
        (mode.value === 'buy' && Number(fromValue.value) > Number(maxBuyAmount.value)) ||
        (mode.value === 'sell' && Number(fromValue.value) > Number(maxSellAmount.value))
      )
    })

    const disabledBuyReason = computed(() => {
      let reason = ''
      if (countDownTime.value.status === CrowdfundingStatus.UPCOMING) {
        reason = 'This dCrowdfunding is not opened yet.'
      } else if (countDownTime.value.status === CrowdfundingStatus.ENDED) {
        reason = 'This dCrowdfunding has ended.'
      } else if (mode.value === 'buy' && raiseState.value.raisePercent >= 100) {
        reason = `The dCrowdfunding has reached goal.`
      } else if (!(Number(fromValue.value) > 0)) {
        reason = `Enter a ${mode.value} amount.`
      } else if (
        mode.value === 'buy' &&
        Number(fromValue.value) > Number(props.info.maxBuyAmount!)
      ) {
        reason = `Cannot buy more than maximum buy amounty.`
      } else if (
        mode.value === 'buy' &&
        Number(fromValue.value) > Number(props.buyCoinInfo.balance!)
      ) {
        reason = `Cannot buy more than your balance.`
      } else if (mode.value === 'sell' && Number(fromValue.value) > Number(maxSellAmount.value)) {
        reason = `Cannot sell more than maximum sell amounty.`
      }
      return reason
    })

    const setMaxBalance = () => {
      if (mode.value === 'buy') {
        fromValue.value = maxBuyAmount.value
      } else {
        fromValue.value = maxSellAmount.value
      }
      console.log('maxBuyAmount.value===>', maxBuyAmount.value, fromValue.value)
      changeFromValue(fromValue.value)
    }

    const getMaxAmount = async () => {
      const buyRes = await fundingContract.maxBuyAmount('', '')

      maxBuy.value = ethers.utils.formatUnits(buyRes[0], props.buyCoinInfo.decimal)
      console.log('maxBuy.value==>', maxBuy.value)
      const sellRes = await fundingContract.maxSellAmount('', '')
      maxSell.value = ethers.utils.formatUnits(sellRes[1], props.sellCoinInfo.decimal)
      console.log('maxSell.value==>', maxSell.value)
    }

    const chainID = walletStore.chainId
    const getFundingState = async () => {
      // console.log('props.info', props.info)
      if (props.info.chainId == chainID) {
        const fundingContractState = await fundingContract.state('', '')
        fundingContractStateSecound.value = fundingContractState
        raiseState.value.raiseGoal = Number(ethers.utils.formatEther(fundingContractState[0]))
        raiseState.value.raiseAmount = Number(ethers.utils.formatEther(fundingContractState[1]))
        raiseState.value.raisePercent = Number(
          formatToFloor((raiseState.value.raiseAmount / raiseState.value.raiseGoal) * 100, 4)
        )
        raiseState.value.swapAmount = Number(ethers.utils.formatEther(fundingContractState[2]))
      } else {
        raiseState.value.raiseGoal = Number(formatToFloor(Number(props.info.raiseGoal), 8))
        raiseState.value.raiseAmount = Number(formatToFloor(Number(props.info.raiseBalance), 8))
        raiseState.value.raisePercent = Number(
          formatToFloor(Number(props.info.raisedPercent) * 100, 4)
        )
        raiseState.value.swapAmount = Number(props.info.swapPercent)
      }
    }

    onMounted(() => {
      getMaxAmount()
      getFundingState()
    })

    const initPage = () => {
      fromValue.value = '0.0'
      toValue.value = '0.0'
      getMaxAmount()
      ctx.emit('refreshCoin')
      // window.location.reload()
    }

    const numberTip = (data: number, symbol = '') => {
      const divClass = 'u-h3'
      const defaultText = Number(data).toLocaleString().includes('.')
        ? Number(data).toLocaleString()
        : Number(data).toLocaleString() + '.00'
      return (
        <UTooltip>
          {{
            trigger: () =>
              data > 1000000 ? (
                <div class={divClass}>{(data / 1000000).toFixed(1).replace(/\.0$/, '')} M</div>
              ) : data > 1000 ? (
                <div class={divClass}>{(data / 1000).toFixed(1).replace(/\.0$/, '')} K</div>
              ) : (
                <div class={divClass}>{data.toFixed(1).replace(/\.0$/, '')} </div>
              ),
            default: () => <div>{defaultText + ' ' + symbol}</div>
          }}
        </UTooltip>
      )
    }

    return () => (
      <UCard>
        <div class="flex gap-6 items-stretch invest">
          <div class="w-[47%]">
            <div class="mb-4 text-color2 u-h5">{countDownTime.value.label}</div>
            <div class="flex mb-15 items-center">
              <span class={`${countDownTime.value.class} mr-2`}>
                {countDownTime.value.value.days}
              </span>
              <span class={`${countDownTime.value.class} mr-2`}>
                {countDownTime.value.value.hours}
              </span>
              <span class={`${countDownTime.value.class} mr-2`}>
                {countDownTime.value.value.minutes}
              </span>
              <span class={`${countDownTime.value.class} mr-2`}>
                {countDownTime.value.value.seconds}
              </span>
            </div>

            <div class="mb-4 text-color2 u-h5">Detail</div>
            <div class="mb-13 grid gap-4 grid-cols-2 u-h7">
              <div class="rounded-sm flex flex-col bg-[rgba(83,49,244,0.06)] h-22 pl-4 justify-center">
                <div class="flex text-primary  items-end">
                  <span class="mr-1">
                    {numberTip(raiseState.value.raiseAmount, props.buyCoinInfo.symbol)}
                  </span>
                  {props.buyCoinInfo.symbol}
                </div>
                <div class="mt-1 text-color3 u-h7">Raised</div>
              </div>
              <div class="rounded-sm flex flex-col bg-[rgba(83,49,244,0.06)] h-22 pl-4 justify-center">
                <div class="flex text-primary items-end">
                  <span class="mr-1">{numberTip(raiseState.value.raisePercent, '%')}</span>%
                </div>
                <div class="mt-1 text-color3 u-h7">Progress</div>
              </div>
              <div class="rounded-sm flex flex-col bg-[rgba(28,96,243,0.06)] bg-opacity-6 h-22 pl-4 justify-center">
                <div class="flex text-primary items-end">
                  <span class="mr-1">
                    {numberTip(raiseState.value.raiseGoal, props.buyCoinInfo.symbol)}
                  </span>
                  {props.buyCoinInfo.symbol}
                </div>
                <div class="mt-1 text-color3 u-h7">Raised Goal</div>
              </div>
              <div class="rounded-sm flex flex-col bg-[rgba(28,96,243,0.06)] bg-opacity-6 h-22 pl-4 justify-center">
                <div class="flex text-primary items-end">
                  <span class="mr-1">
                    {numberTip(raiseState.value.swapAmount, props.buyCoinInfo.symbol)}
                  </span>
                  {props.buyCoinInfo.symbol}
                </div>
                <div class="mt-1 text-color3 u-h7">Available Swap</div>
              </div>
            </div>

            <div class="mb-6 text-color2 u-h5">Token</div>
            <div class="u-h5">
              <div class="token-info-item">
                <span class="token-info-item-label">Totally Supply：</span>
                <span class="text-color2  truncate">
                  {props.sellCoinInfo.supply} {props.sellCoinInfo.symbol}
                </span>
              </div>
              <div class="token-info-item">
                <span class="token-info-item-label">Token Name：</span>
                <span class="text-color2  truncate">{props.sellCoinInfo.symbol}</span>
              </div>
              <div class="token-info-item">
                <span class="token-info-item-label">Token Symbol：</span>
                <span class="text-color2  truncate">{props.sellCoinInfo.symbol}</span>
              </div>
              <div class="mb-0 token-info-item">
                <div class="token-info-item-label">Token Contract：</div>
                <UAddress
                  class="token-info-item-address"
                  address={props.info.sellTokenContract}
                  autoSlice={true}
                />
              </div>
            </div>
          </div>
          <div class="bg-border-color border-1 w-px"></div>
          <div class="w-[52%]">
            <div class="flex mb-3 justify-between">
              <span class="text-color1 u-h4">{mode.value === 'buy' ? 'Invest' : 'Sell'}</span>
              <span class="flex leading-snug items-center">
                <img src={chainInfo?.logo} class="h-4 w-4" />
                <span class="ml-2 text-color2 u-h6">{chainInfo?.name}</span>
              </span>
            </div>
            <div class=" text-primary mb-10 u-num1">
              Rate：1 {props.buyCoinInfo.symbol} = {props.info.buyPrice} {props.sellCoinInfo.symbol}
            </div>
            <div class="flex mb-2 justify-between">
              <span class="text-color3 u-h7">From</span>
              <span class="text-primary1 u-num1">
                Balance :
                {(mode.value === 'buy' ? props.buyCoinInfo.balance : props.sellCoinInfo.balance) ||
                  0}
              </span>
            </div>
            {/* TODO max bug */}
            <UInputNumberGroup
              v-model:value={fromValue.value}
              v-slots={{
                suffix: () => (
                  <div class="cursor-pointer u-label1" onClick={setMaxBalance}>
                    MAX
                  </div>
                )
              }}
              type="withUnit"
              inputProps={{
                // onInput: changeFromValue,
                placeholder: '0.0',
                precision: mode.value === 'buy' ? getBuyCoinDecimal() : props.sellCoinInfo.decimal,
                max: mode.value === 'buy' ? maxBuyAmount.value : maxSellAmount.value
              }}
              renderUnit={() =>
                renderUnit(
                  mode.value === 'buy' ? props.buyCoinInfo.symbol! : props.sellCoinInfo.symbol!
                )
              }
            />
            <div class="flex justify-center">
              <div
                class="bg-purple-light rounded-full cursor-pointer flex h-9 my-8 w-9 justify-center items-center"
                onClick={changeMode}
              >
                <ExchangeOutlined />
              </div>
            </div>
            <div class="flex mb-2 justify-between">
              <span class="text-color3 u-h7">To</span>
              <span class="text-primary1 u-num1">
                Balance :
                {(mode.value === 'buy' ? props.sellCoinInfo.balance : props.buyCoinInfo.balance) ||
                  0}
              </span>
            </div>
            <div>
              <UInputNumberGroup
                v-model:value={toValue.value}
                inputProps={{
                  // onInput: changeToValue,
                  placeholder: '0.0',
                  precision:
                    mode.value === 'sell' ? getBuyCoinDecimal() : props.sellCoinInfo.decimal,
                  max: mode.value === 'buy' ? maxSellAmount.value : maxBuyAmount.value
                }}
                v-slots={{
                  suffix: () => null
                }}
                type="withUnit"
                renderUnit={() =>
                  renderUnit(
                    mode.value === 'buy' ? props.sellCoinInfo.symbol! : props.buyCoinInfo.symbol!
                  )
                }
              />
            </div>
            <div class="flex mt-8.5 mb-6 gap-4 items-center">
              {props.info.comerId === userStore.profile?.comerID &&
                (disableRemoveOrCancelReason.value ? (
                  <UTooltip>
                    {{
                      trigger: () => (
                        <UButton
                          tag="div"
                          type="primary"
                          class="basis-1/3"
                          size="small"
                          style={{
                            '--n-color-disabled': '#E0E0E0',
                            '--n-opacity-disabled': 1,
                            '--n-border-disabled': '1px solid #E0E0E0'
                          }}
                          onClick={removeOrCancel}
                          disabled={disableRemoveOrCancel.value}
                        >
                          {founderOperation.value}
                        </UButton>
                      ),
                      default: () => <div class="max-w-90">{disableRemoveOrCancelReason.value}</div>
                    }}
                  </UTooltip>
                ) : (
                  <UButton
                    type="primary"
                    class="basis-1/3"
                    size="small"
                    style={{
                      '--n-color-disabled': '#E0E0E0',
                      '--n-opacity-disabled': 1,
                      '--n-border-disabled': '1px solid #E0E0E0'
                    }}
                    onClick={removeOrCancel}
                    disabled={disableRemoveOrCancel.value}
                  >
                    {founderOperation.value}
                  </UButton>
                ))}

              {/* if has disabledBuyReason, show tooltip */}
              {disabledBuyReason.value ? (
                <UTooltip>
                  {{
                    trigger: () => (
                      <UButton
                        type="primary"
                        class="flex-1"
                        size="small"
                        tag="div"
                        style={{
                          '--n-color-disabled': '#E0E0E0',
                          '--n-opacity-disabled': 1,
                          '--n-border-disabled': '1px solid #E0E0E0'
                        }}
                        onClick={buyOrSell}
                        disabled={disabledBuyOrSell.value}
                      >
                        {mode.value === 'buy' ? 'Buy' : 'Sell'}
                      </UButton>
                    ),
                    default: () => <div class="max-w-90">{disabledBuyReason.value}</div>
                  }}
                </UTooltip>
              ) : (
                <UButton
                  type="primary"
                  class="flex-1"
                  size="small"
                  style={{
                    '--n-color-disabled': '#E0E0E0',
                    '--n-opacity-disabled': 1,
                    '--n-border-disabled': '1px solid #E0E0E0'
                  }}
                  onClick={buyOrSell}
                  disabled={disabledBuyOrSell.value}
                >
                  {mode.value === 'buy' ? 'Buy' : 'Sell'}
                </UButton>
              )}
            </div>
            <UCard>
              <div class="flex mb-4 u-h6">
                <span class="flex flex-1 text-color1 overflow-hidden items-center">
                  Swap %：
                  <UTooltip>
                    {{
                      trigger: () => <QuestionFilled class="h-4 text-color3 w-4" />,
                      default: () => (
                        <div class="max-w-90">
                          Part of the funds raised will go into the swap pool as a fixed-price
                          exchangeable currency, and part will go directly to the team wallet
                        </div>
                      )
                    }}
                  </UTooltip>
                </span>
                <span class="text-color2">{props.info.swapPercent} %</span>
              </div>
              <div class="flex mb-4 u-h6">
                <span class="flex flex-1 text-color1 overflow-hidden items-center">
                  Maximum buy：
                </span>
                <span class="text-color2">
                  {props.info.maxBuyAmount} {props.buyCoinInfo.symbol}
                </span>
              </div>
              <div class="flex mb-4 u-h6">
                <span class="flex flex-1 text-color1 overflow-hidden items-center">
                  Sell tax %：
                  <UTooltip>
                    {{
                      trigger: () => <QuestionFilled class="h-4 text-color3 w-4" />,
                      default: () => (
                        <div class="max-w-90">
                          When selling tokens, a {props.info.sellTax} % fee needs to be deducted as
                          sell tax
                        </div>
                      )
                    }}
                  </UTooltip>
                </span>
                <span class="text-color2">{props.info.sellTax} %</span>
              </div>
              <div class="flex u-h6">
                <span class="flex flex-1 text-color1 overflow-hidden items-center">
                  Maximum sell % ：
                  <UTooltip>
                    {{
                      trigger: () => <QuestionFilled class="h-4 text-color3 w-4" />,
                      default: () => (
                        <div class="max-w-90">
                          The maximum sellable percentage of tokens you own
                        </div>
                      )
                    }}
                  </UTooltip>
                </span>
                <span class="text-color2">{props.info.maxSellPercent} %</span>
              </div>
            </UCard>
          </div>
        </div>

        <UModal v-model:show={cancelModal.value} maskClosable={false}>
          <UCard
            style={{ width: '540px' }}
            closable={true}
            onClose={() => (cancelModal.value = false)}
            v-slots={{
              header: () => {
                return (
                  <div class="flex relative items-center">
                    <span class="text-color1 u-h3">Cancel the dCrowdfunding?</span>
                  </div>
                )
              }
            }}
          >
            <div class="min-h-20 p-4 text-color2 u-h6">
              The dCrowdfungding will be closed at once you click 'Yes'.
            </div>
            <div class="flex mt-4 justify-end">
              <UButton
                type="primary"
                ghost
                class="mr-4 w-41"
                onClick={() => (cancelModal.value = false)}
              >
                Cancel
              </UButton>
              <UButton type="primary" class="w-41" onClick={cancelCrowdfunding}>
                Yes
              </UButton>
            </div>
          </UCard>
        </UModal>
        <UModal v-model:show={removeModal.value} maskClosable={false}>
          <UCard
            style={{ width: '540px' }}
            closable={true}
            onClose={() => (removeModal.value = false)}
            v-slots={{
              header: () => {
                return (
                  <div class="flex relative items-center">
                    <span class="text-color1 u-h3">Remove the dCrowdfunding?</span>
                  </div>
                )
              }
            }}
          >
            <div class="min-h-20 p-4 text-color2 u-h6">
              All fundings will be sent to team wallet at once you click 'Yes'.
            </div>

            <div class="flex mt-4 justify-end">
              <UButton
                type="primary"
                ghost
                class="mr-4 w-41"
                onClick={() => (removeModal.value = false)}
              >
                Cancel
              </UButton>
              <UButton type="primary" class="w-41" onClick={removeCrowdfunding}>
                Yes
              </UButton>
            </div>
          </UCard>
        </UModal>
      </UCard>
    )
  }
})
