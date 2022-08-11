import { UAddress, UButton, UInputNumberGroup, UTooltip } from '@comunion/components'
import { ExchangeOutlined, QuestionFilled } from '@comunion/icons'
import dayjs from 'dayjs'
import { BigNumber, Contract, ethers } from 'ethers'
import { defineComponent, computed, PropType, ref, onMounted, watch } from 'vue'
import { CoinType } from '../[id]'
import { CrowdfundingStatus, getChainInfoByChainId } from '../utils'
import { useErc20Contract, useCrowdfundingContract } from '@/contracts'
import { ServiceReturn } from '@/services'
import { useUserStore, useWalletStore } from '@/stores'
import { useContractStore } from '@/stores/contract'

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
    }
  },
  setup(props) {
    const walletStore = useWalletStore()
    const userStore = useUserStore()
    const contractStore = useContractStore()
    const fromValue = ref('0.0')
    const toValue = ref('0.0')
    const fundingContract = useCrowdfundingContract({
      addresses: { [walletStore.chainId!]: props.info.crowdfundingContract }
    })
    const mode = ref<'buy' | 'sell'>('buy')
    const buyCoinInfo = ref<CoinType>({ name: '', address: '' })
    const sellCoinInfo = ref<CoinType>({ name: '', address: '' })
    const tokenContract = useErc20Contract()

    watch(
      () => fromValue.value,
      value => {
        console.log('fromValue==>', value)

        toValue.value =
          Number(value) < 1
            ? (Number(value) / props.info.buyPrice).toFixed(6)
            : BigNumber.from(value.toString()).div(BigNumber.from(props.info.buyPrice)).toString()
        console.log('toValue.value==>', toValue.value)
      }
    )

    // watch(
    //   () => toValue.value,
    //   value => {
    //     fromValue.value = BigNumber.from(value || 0)
    //       .mul(BigNumber.from(props.info.buyPrice))
    //       .toString()
    //   }
    // )

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

    const getTokenName = async () => {
      const sellRes = await tokenContract(props.info!.sellTokenContract!)
      const [name, decimal, supply, symbol, balance] = await Promise.all([
        sellRes.name(),
        sellRes.decimals(),
        sellRes.totalSupply(),
        sellRes.symbol(),
        sellRes.balanceOf(walletStore.address)
      ])

      sellCoinInfo.value.name = name
      sellCoinInfo.value.decimal = decimal
      sellCoinInfo.value.supply = ethers.utils.formatEther(supply.toString()).toString()
      sellCoinInfo.value.symbol = symbol
      sellCoinInfo.value.balance = ethers.utils.formatUnits(balance, decimal)

      if (buyIsMainCoin.value) {
        buyCoinInfo.value.symbol = getChainInfoByChainId(props.info.chainId)?.currencySymbol
        buyCoinInfo.value.balance = await walletStore.getBalance(walletStore.address!)
      } else {
        const buyTokenRes = await tokenContract(props.info.buyTokenContract)
        const [buyName, buyDecimal, buySymbol, buyBalance] = await Promise.all([
          await buyTokenRes.name(),
          await buyTokenRes.decimals(),
          await buyTokenRes.symbol(),
          await buyTokenRes.balanceOf(walletStore.address)
        ])
        buyCoinInfo.value.name = buyName
        buyCoinInfo.value.decimal = buyDecimal
        buyCoinInfo.value.symbol = buySymbol
        buyCoinInfo.value.balance = ethers.utils.formatUnits(buyBalance, decimal)
      }
    }

    onMounted(() => {
      getTokenName()
    })

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
      if (dayjs().isBefore(dayjs(props.info.startTime))) {
        return {
          status: CrowdfundingStatus.UPCOMING,
          label: 'Crowdfunding Starts In',
          value: countDown,
          class: 'bg-[rgba(83,49,244,0.06)] text-primary'
        }
      }
      if (dayjs().isAfter(props.info.endTime)) {
        return {
          status: CrowdfundingStatus.ENDED,
          label: 'Crowdfunding Has Ended',
          value: countDown,
          class: 'bg-[rgba(242,159,57,0.06)] text-warning'
        }
      }

      // after start and before end
      return {
        status: CrowdfundingStatus.LIVE,
        label: 'Crowdfunding Ends In',
        value: countDown,
        class: 'bg-[rgba(83,49,244,0.06)] text-primary'
      }
    })

    const chainInfo = computed(() => {
      return getChainInfoByChainId(props.info.chainId)
    })

    const disableRemoveOrCancel = computed(() => {
      return (
        props.info.status === CrowdfundingStatus.ENDED ||
        countDownTime.value.status === CrowdfundingStatus.UPCOMING
      )
    })

    const removeOrCancel = () => {
      //
    }

    const buyFromMainCoin = (sellAmount: number | BigNumber) => {
      console.log('fromValue.value==>', fromValue.value)
      console.log('toValue.value==>', toValue.value)

      const buyAmount = ethers.utils.parseEther(
        Number(fromValue.value) < 1 ? fromValue.value : BigNumber.from(fromValue.value).toString()
      )
      // main coin buy token
      fundingContract.buy(
        buyAmount,
        sellAmount,
        'Waiting to submit all contents to blockchain for buying',
        'buying',
        {
          value: ethers.utils.parseEther(fromValue.value)
        }
      )
    }

    const buyFromTokenCoin = async (sellAmount: number | BigNumber) => {
      try {
        const approvePendingText =
          'Waiting to submit all contents to blockchain for approval deposit'
        const buyAmount = ethers.utils.parseUnits(
          Number(fromValue.value) < 1 ? fromValue.value : BigNumber.from(fromValue.value).toString()
        )
        contractStore.startContract(approvePendingText)
        const buyTokenRes = await tokenContract(props.info.buyTokenContract)
        const decimal = await buyTokenRes.decimal()
        const approveRes: Contract = await buyTokenRes.approve(
          props.info.crowdfundingContract,
          ethers.utils.parseUnits(fromValue.value.toString(), decimal)
        )
        await approveRes.wait()

        fundingContract.buy(
          buyAmount,
          sellAmount,
          'Waiting to submit all contents to blockchain for buying',
          'buying'
        )
      } catch (error) {
        console.error(error)
        contractStore.endContract('failed', { success: false })
      }
    }

    const sellToMainCoin = async () => {
      try {
        const fromAmount = ethers.utils.parseUnits(
          Number(fromValue.value) < 1 ? fromValue.value : BigNumber.from(fromValue.value).toString()
        )
        const toAmount = ethers.utils.parseUnits(
          Number(toValue.value) < 1 ? toValue.value : BigNumber.from(toValue.value).toString()
        )
        const approvePendingText =
          'Waiting to submit all contents to blockchain for approval deposit'
        contractStore.startContract(approvePendingText)
        const buyTokenRes = await tokenContract(props.info.buyTokenContract)
        const decimal = await buyTokenRes.decimal()
        const approveRes: Contract = await buyTokenRes.approve(
          props.info.crowdfundingContract,
          ethers.utils.parseUnits(fromValue.value.toString(), decimal)
        )
        await approveRes.wait()

        fundingContract.buy(
          fromAmount,
          toAmount,
          'Waiting to submit all contents to blockchain for buying',
          'buying'
        )
      } catch (error) {
        console.error('error', error)
      }
    }

    const sellToTokenCoin = async () => {
      try {
        const fromAmount = ethers.utils.parseUnits(
          Number(fromValue.value) < 1 ? fromValue.value : BigNumber.from(fromValue.value).toString()
        )

        const approvePendingText =
          'Waiting to submit all contents to blockchain for approval deposit'
        contractStore.startContract(approvePendingText)
        const sellTokenRes = await tokenContract(props.info.sellTokenContract)
        const sellDecimal = await sellTokenRes.decimal()
        const approveRes: Contract = await sellTokenRes.approve(
          props.info.crowdfundingContract,
          ethers.utils.parseUnits(fromValue.value.toString(), sellDecimal)
        )
        await approveRes.wait()

        const buyTokenRes = await tokenContract(props.info.buyTokenContract)
        const buyDecimal = await buyTokenRes.decimal()
        const toAmount = ethers.utils.parseUnits(
          Number(toValue.value) < 1 ? toValue.value : BigNumber.from(toValue.value).toString(),
          buyDecimal
        )

        fundingContract.buy(
          fromAmount,
          toAmount,
          'Waiting to submit all contents to blockchain for buying',
          'buying'
        )
      } catch (error) {
        console.error('error', error)
      }
    }

    const buyOrSell = async () => {
      if (mode.value === 'buy') {
        const sellAmount = ethers.utils.parseUnits(
          Number(toValue.value) < 1 ? toValue.value : BigNumber.from(toValue.value).toString()
        )
        if (buyIsMainCoin.value) {
          buyFromMainCoin(sellAmount)
        } else {
          // other coin buy
          buyFromTokenCoin(sellAmount)
        }
      } else {
        if (buyIsMainCoin.value) {
          sellToMainCoin()
        } else {
          sellToTokenCoin()
        }
      }
    }

    return () => (
      <div class="flex items-stretch gap-6 p-10 bg-white border-1 border-grey5 mb-6 rounded-lg">
        <div class="flex-1">
          <div class="u-title2 mb-4">{countDownTime.value.label}</div>
          <div class="flex items-center mb-12">
            <span
              class={`${countDownTime.value.class} text-center leading-10 rounded-lg w-9 h-10 mr-2`}
            >
              {countDownTime.value.value.days}
            </span>
            <span
              class={[countDownTime.value.class, 'text-center leading-10 rounded-lg w-9 h-10 mr-2']}
            >
              {countDownTime.value.value.hours}
            </span>
            <span
              class={[countDownTime.value.class, 'text-center leading-10 rounded-lg w-9 h-10 mr-2']}
            >
              {countDownTime.value.value.minutes}
            </span>
            <span
              class={[countDownTime.value.class, 'text-center leading-10 rounded-lg w-9 h-10 mr-2']}
            >
              {countDownTime.value.value.seconds}
            </span>
          </div>
          <div class="u-title2 mb-4">Crowdfunding Detail</div>
          <div class="grid grid-cols-2 gap-4 mb-13">
            <div class="h-22 flex flex-col justify-center pl-4 bg-[rgba(83,49,244,0.06)]">
              <div class="leading-loose">
                {(props.info.raiseGoal - props.info.raiseBalance).toFixed(2)}{' '}
                {buyCoinInfo.value.symbol}
              </div>
              <div class="text-xs text-grey3">Raised</div>
            </div>
            <div class="h-22 flex flex-col justify-center pl-4 bg-[rgba(83,49,244,0.06)]">
              <div class="leading-loose">{props.info.raisedPercent * 100} %</div>
              <div class="text-xs text-grey3">Progress</div>
            </div>
            <div class="h-22 flex flex-col justify-center pl-4 bg-[rgba(28,96,243,0.06)] bg-opacity-6">
              <div class="leading-loose">
                {props.info.raiseGoal} {buyCoinInfo.value.symbol}
              </div>
              <div class="text-xs text-grey3">Raised Goal</div>
            </div>
            <div class="h-22 flex flex-col justify-center pl-4 bg-[rgba(28,96,243,0.06)] bg-opacity-6">
              <div class="leading-loose">
                {((props.info.raiseBalance * props.info.swapPercent) / 100).toFixed(2)}
                {buyCoinInfo.value.symbol}
              </div>
              <div class="text-xs text-grey3">Available Swap</div>
            </div>
          </div>
          <div class="u-title2 mb-6">Token Information</div>
          <div class="grid grid-cols-2 gap-y-4 justify-between u-body2">
            <div class="text-grey3">Totally Supply：</div>
            <div class="text-grey1 text-right">
              {sellCoinInfo.value.supply} {sellCoinInfo.value.symbol}{' '}
            </div>
            <div class="text-grey3">Token Name：</div>
            <div class="text-grey1 text-right">{sellCoinInfo.value.symbol}</div>
            <div class="text-grey3">Token Symbol：</div>
            <div class="text-grey1 text-right">{sellCoinInfo.value.symbol}</div>
            <div class="text-grey3">Token Contract：</div>
            <div class="text-right">
              <UAddress address={props.info.sellTokenContract} autoSlice={true} />
            </div>
          </div>
        </div>
        <div class="w-px bg-grey5"></div>
        <div class="flex-1">
          <div class="flex justify-between mb-2">
            <span class="u-title1">{mode.value === 'buy' ? 'INVEST' : 'SELL'}</span>
            <span class="bg-[rgba(83,49,244,0.06)] flex items-center px-4 py-1 text-primary1 rounded-4xl leading-snug">
              <img src={chainInfo.value?.logo} class="w-5 h-5" />{' '}
              <span class="ml-2">{chainInfo.value?.name}</span>
            </span>
          </div>
          <div class="u-body2 !text-primary mb-10">
            IBO Rate：1 {buyCoinInfo.value.symbol} = {props.info.buyPrice}{' '}
            {sellCoinInfo.value.symbol}
          </div>
          <div class="flex justify-between mb-2">
            <span>From</span>
            <span>
              Balance :{' '}
              {(mode.value === 'buy' ? buyCoinInfo.value.balance : sellCoinInfo.value.balance) || 0}
            </span>
          </div>
          <div>
            <UInputNumberGroup
              v-model:value={fromValue.value}
              v-slots={{ suffix: () => <div class="text-primary cursor-pointer">MAX</div> }}
              type="withUnit"
              renderUnit={() =>
                renderUnit(
                  mode.value === 'buy' ? buyCoinInfo.value.symbol! : sellCoinInfo.value.symbol!
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
            <span>To</span>
            <span>
              Balance :{' '}
              {(mode.value === 'buy' ? sellCoinInfo.value.balance : buyCoinInfo.value.balance) || 0}
            </span>
          </div>
          <div>
            <UInputNumberGroup
              v-model:value={toValue.value}
              type="withUnit"
              renderUnit={() =>
                renderUnit(
                  mode.value === 'buy' ? sellCoinInfo.value.symbol! : buyCoinInfo.value.symbol!
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
                onClick={removeOrCancel}
                disabled={disableRemoveOrCancel.value}
              >
                {countDownTime.value.status === CrowdfundingStatus.ENDED ||
                props.info.raiseBalance === 0
                  ? 'Remove'
                  : 'Cancel'}
              </UButton>
            )}
            <UButton type="primary" class="flex-1" size="small" onClick={buyOrSell}>
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
                    default: () =>
                      'Part of the funds raised will go into the swap pool as a fixed-price exchangeable currency, and part will go directly to the team wallet'
                  }}
                </UTooltip>
              </span>
              <span>{props.info.swapPercent} %</span>
            </div>
            <div class="flex justify-between u-body2">
              <span class="flex items-center text-sm mb-4 text-grey3">Maximum buy：</span>
              <span>{props.info.maxSellPercent}</span>
            </div>
            <div class="flex justify-between u-body2">
              <span class="flex items-center text-sm mb-4 text-grey3">
                Sell tax %：
                <UTooltip>
                  {{
                    trigger: () => <QuestionFilled class="w-4 h-4 text-grey3" />,
                    default: () => 'When selling tokens, a 20% fee needs to be deducted as sell tax'
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
                    default: () => 'The maximum sellable percentage of tokens you own'
                  }}
                </UTooltip>
              </span>
              <span>{props.info.maxSellPercent} %</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
})
