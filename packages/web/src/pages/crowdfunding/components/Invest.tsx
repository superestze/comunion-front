import { UAddress, UButton, UCard, UInputNumberGroup, UModal, UTooltip } from '@comunion/components'
import { ExchangeOutlined, QuestionFilled } from '@comunion/icons'
import dayjs from 'dayjs'
import { BigNumber, Contract, ethers } from 'ethers'
import { defineComponent, computed, PropType, ref, onMounted } from 'vue'
import { CoinType } from '../[id]'
import { CrowdfundingStatus } from '../utils'
import { useErc20Contract, useCrowdfundingContract } from '@/contracts'
import { ServiceReturn, services } from '@/services'
import { useUserStore, useWalletStore } from '@/stores'
import { useContractStore } from '@/stores/contract'
import { getChainInfoByChainId } from '@/utils/etherscan'
import { formatToFloor } from '@/utils/numberFormat'
import './invest.css'

export const renderUnit = (name: string) => (
  <div
    class={[
      'u-label2 flex justify-center items-center border rounded-r-lg bg-purple w-30',
      { 'text-color1': name, 'text-grey4': !name }
    ]}
  >
    {name || 'Token'}
  </div>
)

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
  emits: ['refreshCoin'],
  setup(props, ctx) {
    const walletStore = useWalletStore()
    const userStore = useUserStore()
    const contractStore = useContractStore()
    const cancelModal = ref(false)
    const removeModal = ref(false)
    const fromValue = ref<string>('0.0')
    const toValue = ref<string>('0.0')
    const raiseState = ref({
      raiseAmount: 0,
      raiseGoal: 0,
      raisePercent: 0,
      swapAmount: 0
    })

    const fundingContractState = ref()
    const fundingContract = useCrowdfundingContract({
      chainId: walletStore.chainId!,
      addresses: { [walletStore.chainId!]: props.info.crowdfundingContract }
    })
    const maxBuy = ref()
    const maxSell = ref()
    const mode = ref<'buy' | 'sell'>('buy')
    const tokenContract = useErc20Contract()

    const chainInfo = getChainInfoByChainId(props.info.chainId)

    const maxBuyAmount = computed(() => {
      return (
        formatToFloor(Math.min(maxBuy.value, Number(props.buyCoinInfo.balance)).toString(), 8) ||
        '0'
      )
    })

    const maxSellAmount = computed(() => {
      return (
        formatToFloor(Math.min(maxSell.value, Number(props.sellCoinInfo.balance)).toString(), 8) ||
        '0'
      )
    })
    const changeFromValue = (value: string) => {
      if (mode.value === 'buy') {
        toValue.value = formatToFloor(Number(value) * props.info.buyPrice, 8)
      } else {
        toValue.value = formatToFloor(Number(value) / props.info.buyPrice, 8)
      }
      console.log('toValue.value==>', toValue.value)
    }

    const changeToValue = (value: string) => {
      if (mode.value === 'buy') {
        fromValue.value = formatToFloor(Number(value) / props.info.buyPrice, 8)
      } else {
        fromValue.value = formatToFloor(Number(value) * props.info.buyPrice, 8)
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
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      }
      if (props.info.status === CrowdfundingStatus.CANCELED) {
        return {
          status: CrowdfundingStatus.CANCELED,
          label: 'dCrowdfunding Has Cancelled',
          value: countDown,
          class: 'bg-[rgba(245,246,250,1)] text-grey5'
        }
      }
      // before start
      if (dayjs.utc().isBefore(dayjs(props.info.startTime).utc())) {
        const [days, hours, minutes, seconds] = dayjs
          .duration(dayjs(props.info.startTime).utc().diff(dayjs.utc()))
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
          class: 'bg-[rgba(83,49,244,0.06)] text-primary'
        }
      }
      if (dayjs.utc().isAfter(dayjs(props.info.endTime).utc())) {
        return {
          status: CrowdfundingStatus.ENDED,
          label: 'dCrowdfunding Has Ended',
          value: countDown,
          class: 'bg-[rgba(242,159,57,0.06)] text-warning'
        }
      }

      // after start and before end
      const diffDuration = dayjs
        .duration(dayjs(props.info.endTime).utc().diff(dayjs.utc()))
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
        class: 'bg-[rgba(83,49,244,0.06)] text-primary'
      }
    })

    const disableRemoveOrCancel = computed(() => {
      if (founderOperation.value === 'Remove') {
        return fundingContractState.value?.[9] === CrowdfundingStatus.ENDED
      } else {
        return countDownTime.value.status !== CrowdfundingStatus.UPCOMING
      }
    })

    const founderOperation = computed(() => {
      return countDownTime.value.status === CrowdfundingStatus.ENDED ? 'Remove' : 'Cancel'
    })

    const removeCrowdfunding = async () => {
      try {
        removeModal.value = false
        const pendingText = 'Waiting to submit all contents to blockchain for removing'
        const waitingText = 'Waiting to confirm'
        const contractRes: any = await fundingContract.remove(pendingText, waitingText)
        await services['crowdfunding@remove-crowdfunding']({
          crowdfundingId: props.info.crowdfundingId,
          txHash: contractRes.hash
        })
      } catch (error) {
        console.log('error', error)
      }
    }

    const cancelCrowdfunding = async () => {
      try {
        cancelModal.value = false
        const pendingText = 'Waiting to submit all contents to blockchain for canceling'
        const waitingText = 'Waiting to confirm'
        const contractRes: any = await fundingContract.cancel(pendingText, waitingText)
        await services['crowdfunding@cancel-crowdfunding']({
          crowdfundingId: props.info.crowdfundingId,
          txHash: contractRes.hash
        })
      } catch (error) {
        console.error('error===>', error)
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
      const buyPendingText = 'Waiting to submit all contents to blockchain for buying'
      const waitingText = 'Waiting to confirm'
      try {
        const buyAmount = ethers.utils.parseEther(fromValue.value)
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
        const buyPendingText = 'Waiting to submit all contents to blockchain for buying'
        const waitingText = 'Waiting to confirm'
        const approvePendingText =
          'Waiting to submit all contents to blockchain for approval deposit'
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
        const sellPendingText = 'Waiting to submit all contents to blockchain for selling'
        const waitingText = 'Waiting to confirm'
        const approvePendingText =
          'Waiting to submit all contents to blockchain for approval deposit'
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

        const sellPendingText = 'Waiting to submit all contents to blockchain for selling'
        const waitingText = 'Waiting to confirm'

        const approvePendingText =
          'Waiting to submit all contents to blockchain for approval deposit'
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
        (mode.value === 'buy' && fromValue.value > maxBuyAmount.value) ||
        (mode.value === 'sell' && toValue.value > maxSellAmount.value)
      )
    })

    const setMaxBalance = () => {
      if (mode.value === 'buy') {
        fromValue.value = maxBuyAmount.value
      } else {
        fromValue.value = maxSellAmount.value
      }
      changeFromValue(fromValue.value)
    }

    const getMaxAmount = async () => {
      const buyRes = await fundingContract.maxBuyAmount('', '')
      console.log('buyRes===>', buyRes)

      maxBuy.value = ethers.utils.formatUnits(buyRes[0], props.buyCoinInfo.decimal)

      const sellRes = await fundingContract.maxSellAmount('', '')
      maxSell.value = ethers.utils.formatUnits(sellRes[1], props.sellCoinInfo.decimal)
      console.log('maxSell.value==>', maxSell.value)
    }

    const chainID = walletStore.chainId
    const getFundingState = async () => {
      // console.log('props.info', props.info)
      if (props.info.chainId == chainID) {
        const fundingContractState = await fundingContract.state('', '')
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

    const numberTip = (data: number) => {
      return (
        <UTooltip>
          {{
            trigger: () => (
              <div class="font-bold font-primary text-primary text-xl leading-8">
                {Number(data).toFixed(2).replace(/\.00$/, '')}
              </div>
            ),
            default: () =>
              data > 1000000 ? (
                <div>{(data / 1000000).toFixed(2)} M</div>
              ) : data > 1000 ? (
                <div>{(data / 1000).toFixed(2)} K</div>
              ) : (
                data
              )
          }}
        </UTooltip>
      )
    }

    return () => (
      <div class="bg-white rounded-lg flex border-1 border-grey5 mb-6 p-10 gap-6 items-stretch invest">
        <div class="flex-1">
          <div class="mb-4 u-title2">{countDownTime.value.label}</div>
          <div class="flex mb-12 items-center">
            <span
              class={`${countDownTime.value.class} font-semibold text-center leading-10 rounded-lg w-9 h-10 mr-2`}
            >
              {countDownTime.value.value.days}
            </span>
            <span
              class={[
                countDownTime.value.class,
                'font-semibold text-center leading-10 rounded-lg w-9 h-10 mr-2'
              ]}
            >
              {countDownTime.value.value.hours}
            </span>
            <span
              class={[
                countDownTime.value.class,
                'font-semibold text-center leading-10 rounded-lg w-9 h-10 mr-2'
              ]}
            >
              {countDownTime.value.value.minutes}
            </span>
            <span
              class={[
                countDownTime.value.class,
                'font-semibold text-center leading-10 rounded-lg w-9 h-10 mr-2'
              ]}
            >
              {countDownTime.value.value.seconds}
            </span>
          </div>
          <div class="mb-4 u-title2">dCrowdfunding Detail</div>
          <div class="mb-13 grid gap-4 grid-cols-2">
            <div class="rounded-lg flex flex-col bg-[rgba(83,49,244,0.06)] h-22 pl-4 justify-center">
              <div class="flex text-primary leading-loose items-end">
                <span class="mr-1">{numberTip(raiseState.value.raiseAmount)}</span>
                {props.buyCoinInfo.symbol}
              </div>
              <div class="text-xs text-grey3">Raised</div>
            </div>
            <div class="rounded-lg flex flex-col bg-[rgba(83,49,244,0.06)] h-22 pl-4 justify-center">
              <div class="flex text-primary leading-loose items-end">
                <span class="mr-1">{numberTip(raiseState.value.raisePercent)}</span>%
              </div>
              <div class="text-xs text-grey3">Progress</div>
            </div>
            <div class="rounded-lg flex flex-col bg-[rgba(28,96,243,0.06)] bg-opacity-6 h-22 pl-4 justify-center">
              <div class="flex text-primary leading-loose items-end">
                <span class="mr-1">{numberTip(raiseState.value.raiseGoal)}</span>
                {props.buyCoinInfo.symbol}
              </div>
              <div class="text-xs text-grey3">Raised Goal</div>
            </div>
            <div class="rounded-lg flex flex-col bg-[rgba(28,96,243,0.06)] bg-opacity-6 h-22 pl-4 justify-center">
              <div class="flex text-primary leading-loose items-end">
                <span class="mr-1">{numberTip(raiseState.value.swapAmount)}</span>
                {props.buyCoinInfo.symbol}
              </div>
              <div class="text-xs text-grey3">Available Swap</div>
            </div>
          </div>
          <div class="mb-6 u-title2">Token Information</div>
          <div class="u-body2">
            <div class="token-info-item">
              <span class="token-info-item-label">Totally Supply：</span>
              <span class="text-color1  whitespace-nowrap">
                {props.sellCoinInfo.supply} {props.sellCoinInfo.symbol}{' '}
              </span>
            </div>
            <div class="token-info-item">
              <span class="token-info-item-label">Token Name：</span>
              <span class="text-color1  whitespace-nowrap">{props.sellCoinInfo.symbol}</span>
            </div>
            <div class="token-info-item">
              <span class="token-info-item-label">Token Symbol：</span>
              <span class="text-color1  whitespace-nowrap">{props.sellCoinInfo.symbol}</span>
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
        <div class="bg-grey5 w-px"></div>
        <div class="flex-1">
          <div class="flex mb-2 justify-between">
            <span class="font-primary u-title1">{mode.value === 'buy' ? 'INVEST' : 'SELL'}</span>
            <span class="flex bg-[rgba(83,49,244,0.06)] rounded-4xl leading-snug py-1 px-4 text-primary1 items-center">
              <img src={chainInfo?.logo} class="h-5 w-5" />{' '}
              <span class="font-opensans font-600 ml-2">{chainInfo?.name}</span>
            </span>
          </div>
          <div class="mb-10 u-body2 !text-primary">
            Rate：1 {props.buyCoinInfo.symbol} = {props.info.buyPrice} {props.sellCoinInfo.symbol}
          </div>
          <div class="flex mb-2 justify-between">
            <span class="text-grey3 u-body2">From</span>
            <span class="text-sm text-primary1 italic u-body3">
              Balance :{' '}
              {(mode.value === 'buy' ? props.buyCoinInfo.balance : props.sellCoinInfo.balance) || 0}
            </span>
          </div>
          <div>
            <UInputNumberGroup
              v-model:value={fromValue.value}
              v-slots={{
                suffix: () => (
                  <div class="cursor-pointer text-primary u-label1" onClick={setMaxBalance}>
                    MAX
                  </div>
                )
              }}
              type="withUnit"
              inputProps={{
                onInput: changeFromValue
                // max: mode.value === 'buy' ? maxBuyAmount.value : maxSellAmount.value
              }}
              renderUnit={() =>
                renderUnit(
                  mode.value === 'buy' ? props.buyCoinInfo.symbol! : props.sellCoinInfo.symbol!
                )
              }
            />
          </div>
          <div class="flex justify-center">
            <div
              class="bg-purple-light rounded-full cursor-pointer flex h-9 my-8 text-primary w-9 justify-center items-center"
              onClick={changeMode}
            >
              <ExchangeOutlined />
            </div>
          </div>
          <div class="flex mb-2 justify-between">
            <span class="text-grey3 u-body2">To</span>
            <span class="text-sm text-primary1 italic u-body3">
              Balance :{' '}
              {(mode.value === 'buy' ? props.sellCoinInfo.balance : props.buyCoinInfo.balance) || 0}
            </span>
          </div>
          <div>
            <UInputNumberGroup
              v-model:value={toValue.value}
              inputProps={{
                onInput: changeToValue
                // max: mode.value === 'buy' ? maxSellAmount.value : maxBuyAmount.value
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
          <div class="flex mt-10 mb-6 gap-4 items-center">
            {props.info.comerId === userStore.profile?.comerID && (
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
            )}
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
          </div>
          <div class="border rounded-lg border-grey5 p-4">
            <div class="flex justify-between u-body2">
              <span class="flex text-sm mb-4 text-grey3 items-center">
                Swap %：
                <UTooltip>
                  {{
                    trigger: () => <QuestionFilled class="h-4 text-grey3 w-4" />,
                    default: () => (
                      <div class="max-w-90">
                        Part of the funds raised will go into the swap pool as a fixed-price
                        exchangeable currency, and part will go directly to the team wallet
                      </div>
                    )
                  }}
                </UTooltip>
              </span>
              <span>{props.info.swapPercent} %</span>
            </div>
            <div class="flex justify-between u-body2">
              <span class="flex text-sm mb-4 text-grey3 items-center">Maximum buy：</span>
              <span>
                {props.info.maxBuyAmount} {props.buyCoinInfo.symbol}
              </span>
            </div>
            <div class="flex justify-between u-body2">
              <span class="flex text-sm mb-4 text-grey3 items-center">
                Sell tax %：
                <UTooltip>
                  {{
                    trigger: () => <QuestionFilled class="h-4 text-grey3 w-4" />,
                    default: () => (
                      <div class="max-w-90">
                        When selling tokens, a {props.info.sellTax} % fee needs to be deducted as
                        sell tax
                      </div>
                    )
                  }}
                </UTooltip>
              </span>
              <span>{props.info.sellTax} %</span>
            </div>
            <div class="flex justify-between u-body2">
              <span class="flex text-sm text-grey3 items-center">
                Maximum sell % ：
                <UTooltip>
                  {{
                    trigger: () => <QuestionFilled class="h-4 text-grey3 w-4" />,
                    default: () => (
                      <div class="max-w-90">The maximum sellable percentage of tokens you own</div>
                    )
                  }}
                </UTooltip>
              </span>
              <span>{props.info.maxSellPercent} %</span>
            </div>
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
                    <span class="text-color1 u-h3">Cancellation of dCrowdfunding</span>
                  </div>
                )
              }
            }}
          >
            <div class="min-h-20 p-4 text-color2 u-h6">
              This can't be undo and you'll lose your changes
            </div>
            <div class="flex mt-20 justify-end">
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
                    <span class="text-color1 u-h3">Remove dCrowdfunding！</span>
                  </div>
                )
              }
            }}
          >
            <div class="min-h-20 p-4 text-color2 u-h6">
              This will transfer all funds raised to the team wallet
            </div>

            <div class="flex mt-20 justify-end">
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
      </div>
    )
  }
})
