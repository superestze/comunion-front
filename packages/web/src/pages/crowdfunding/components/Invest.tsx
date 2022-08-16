import { UAddress, UButton, UCard, UInputNumberGroup, UModal, UTooltip } from '@comunion/components'
import { ExchangeOutlined, QuestionFilled } from '@comunion/icons'
import dayjs from 'dayjs'
import { BigNumber, Contract, ethers } from 'ethers'
import { defineComponent, computed, PropType, ref, onMounted } from 'vue'
import { CoinType } from '../[id]'
import { CrowdfundingStatus, getChainInfoByChainId } from '../utils'
import { useErc20Contract, useCrowdfundingContract } from '@/contracts'
import { ServiceReturn, services } from '@/services'
import { useUserStore, useWalletStore } from '@/stores'
import { useContractStore } from '@/stores/contract'
import { formatToFloor } from '@/utils/numberFormat'
import './invest.css'

export const renderUnit = (name: string) => (
  <div
    class={[
      'flex justify-center items-center border rounded-r-lg bg-purple w-30',
      { 'text-grey1': name, 'text-grey4': !name }
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
    console.log('fundingContract===>', props.info.crowdfundingContract)
    console.log('walletStore.chainId===>', walletStore.chainId)

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
          label: 'Crowdfunding Has Cancelled',
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
          label: 'Crowdfunding Starts In',
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
          label: 'Crowdfunding Has Ended',
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
        label: 'Crowdfunding Ends In',
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
      return countDownTime.value.status === CrowdfundingStatus.ENDED ||
        (props.info.status === CrowdfundingStatus.LIVE && props.info.raisedPercent * 100 === 100)
        ? 'Remove'
        : 'Cancel'
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

    const removeOrCancel = async () => {
      //
      try {
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

    const getFundingState = async () => {
      fundingContractState.value = await fundingContract.state('', '')
      console.log('fundingContractState.value===>', fundingContractState.value)
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
              <div class="text-primary text-xl font-bold font-orbitron leading-8">
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
      <div class="flex items-stretch gap-6 p-10 bg-white border-1 border-grey5 mb-6 rounded-lg invest">
        <div class="flex-1">
          <div class="u-title2 mb-4">{countDownTime.value.label}</div>
          <div class="flex items-center mb-12">
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
          <div class="u-title2 mb-4">Crowdfunding Detail</div>
          <div class="grid grid-cols-2 gap-4 mb-13">
            <div class="rounded-lg h-22 flex flex-col justify-center pl-4 bg-[rgba(83,49,244,0.06)]">
              <div class="leading-loose text-primary flex items-end">
                <span class="mr-1">{numberTip(props.info.raiseBalance)}</span>
                {props.buyCoinInfo.symbol}
              </div>
              <div class="text-xs text-grey3">Raised</div>
            </div>
            <div class="rounded-lg h-22 flex flex-col justify-center pl-4 bg-[rgba(83,49,244,0.06)]">
              <div class="leading-loose text-primary flex items-end">
                <span class="mr-1">{numberTip(props.info.raisedPercent * 100)}</span>%
              </div>
              <div class="text-xs text-grey3">Progress</div>
            </div>
            <div class="rounded-lg h-22 flex flex-col justify-center pl-4 bg-[rgba(28,96,243,0.06)] bg-opacity-6">
              <div class="leading-loose text-primary flex items-end">
                <span class="mr-1">{numberTip(props.info.raiseGoal)}</span>
                {props.buyCoinInfo.symbol}
              </div>
              <div class="text-xs text-grey3">Raised Goal</div>
            </div>
            <div class="rounded-lg h-22 flex flex-col justify-center pl-4 bg-[rgba(28,96,243,0.06)] bg-opacity-6">
              <div class="leading-loose text-primary flex items-end">
                <span class="mr-1">
                  {numberTip((props.info.raiseBalance * props.info.swapPercent) / 100)}
                </span>
                {props.buyCoinInfo.symbol}
              </div>
              <div class="text-xs text-grey3">Available Swap</div>
            </div>
          </div>
          <div class="u-title2 mb-6">Token Information</div>
          <div class="u-body2">
            <div class="token-info-item">
              <span class="token-info-item-label">Totally Supply：</span>
              <span class="text-grey1  whitespace-nowrap">
                {props.sellCoinInfo.supply} {props.sellCoinInfo.symbol}{' '}
              </span>
            </div>
            <div class="token-info-item">
              <span class="token-info-item-label">Token Name：</span>
              <span class="text-grey1  whitespace-nowrap">{props.sellCoinInfo.symbol}</span>
            </div>
            <div class="token-info-item">
              <span class="token-info-item-label">Token Symbol：</span>
              <span class="text-grey1  whitespace-nowrap">{props.sellCoinInfo.symbol}</span>
            </div>
            <div class="token-info-item mb-0">
              <div class="token-info-item-label">Token Contract：</div>
              <UAddress
                class="token-info-item-address"
                address={props.info.sellTokenContract}
                autoSlice={true}
              />
            </div>
          </div>
        </div>
        <div class="w-px bg-grey5"></div>
        <div class="flex-1">
          <div class="flex justify-between mb-2">
            <span class="u-title1 font-orbitron">{mode.value === 'buy' ? 'INVEST' : 'SELL'}</span>
            <span class="bg-[rgba(83,49,244,0.06)] flex items-center px-4 py-1 text-primary1 rounded-4xl leading-snug">
              <img src={chainInfo?.logo} class="w-5 h-5" />{' '}
              <span class="ml-2 font-opensans">{chainInfo?.name}</span>
            </span>
          </div>
          <div class="u-body2 !text-primary mb-10">
            IBO Rate：1 {props.buyCoinInfo.symbol} = {props.info.buyPrice}{' '}
            {props.sellCoinInfo.symbol}
          </div>
          <div class="flex justify-between mb-2">
            <span class="u-body2 text-grey3">From</span>
            <span class="u-body3 text-sm text-primary1 italic">
              Balance :{' '}
              {(mode.value === 'buy' ? props.buyCoinInfo.balance : props.sellCoinInfo.balance) || 0}
            </span>
          </div>
          <div>
            <UInputNumberGroup
              v-model:value={fromValue.value}
              v-slots={{
                suffix: () => (
                  <div class="u-label1 text-primary cursor-pointer" onClick={setMaxBalance}>
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
              class="flex justify-center items-center text-primary h-9 w-9 bg-purple-light my-8 rounded-full cursor-pointer"
              onClick={changeMode}
            >
              <ExchangeOutlined />
            </div>
          </div>
          <div class="flex justify-between mb-2">
            <span class="u-body2 text-grey3">To</span>
            <span class="u-body3 text-sm text-primary1 italic">
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
          <div class="flex items-center mt-10 mb-6 gap-4">
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
          <div class="border border-grey5 p-4 rounded-lg">
            <div class="flex justify-between u-body2">
              <span class="flex items-center text-sm mb-4 text-grey3">
                Swap %：
                <UTooltip>
                  {{
                    trigger: () => <QuestionFilled class="w-4 h-4 text-grey3" />,
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
              <span class="flex items-center text-sm mb-4 text-grey3">Maximum buy：</span>
              <span>
                {props.info.maxBuyAmount} {props.buyCoinInfo.symbol}
              </span>
            </div>
            <div class="flex justify-between u-body2">
              <span class="flex items-center text-sm mb-4 text-grey3">
                Sell tax %：
                <UTooltip>
                  {{
                    trigger: () => <QuestionFilled class="w-4 h-4 text-grey3" />,
                    default: () => (
                      <div class="max-w-90">
                        When selling tokens, a 20% fee needs to be deducted as sell tax
                      </div>
                    )
                  }}
                </UTooltip>
              </span>
              <span>{props.info.sellTax} %</span>
            </div>
            <div class="flex justify-between u-body2">
              <span class="flex items-center text-sm text-grey3">
                Maximum sell % ：
                <UTooltip>
                  {{
                    trigger: () => <QuestionFilled class="w-4 h-4 text-grey3" />,
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
            class="!p-7"
            onClose={() => (cancelModal.value = false)}
          >
            <div class="u-title1 relative -top-3 ">Cancellation of Crowdfunding</div>
            <div class="u-body2 text-grey3">This can't be undo and you'll lose your changes</div>
            <div class="flex justify-end mt-20">
              <UButton
                type="primary"
                ghost
                class="w-41 mr-4"
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
            class="!p-7"
            onClose={() => (removeModal.value = false)}
          >
            <div class="u-title1 relative -top-3 ">Remove Crowdfunding！</div>
            <div class="u-body2 text-grey3">
              This will transfer all funds raised to the team wallet
            </div>
            <div class="flex justify-end mt-20">
              <UButton
                type="primary"
                ghost
                class="w-41 mr-4"
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
