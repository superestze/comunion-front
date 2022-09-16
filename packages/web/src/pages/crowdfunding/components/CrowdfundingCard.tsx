import { ULazyImage, UTag, UProgress } from '@comunion/components'
import dayjs from 'dayjs'
import { ethers } from 'ethers'
import { defineComponent, PropType, computed, ref, onMounted } from 'vue'
import { CrowdfundingStatus } from '../utils'
import { CROWDFUNDING_TYPES } from '@/constants'
import { useErc20Contract, useCrowdfundingContract } from '@/contracts'
import { useWalletStore } from '@/stores'
import { CrowdfundingItem } from '@/types'
import { getChainInfoByChainId } from '@/utils/etherscan'
import { formatToFloor } from '@/utils/numberFormat'

export const CrowdfundingCard = defineComponent({
  name: 'CrowdfundingCard',
  props: {
    info: {
      type: Object as PropType<CrowdfundingItem>,
      required: true
    },
    onClick: {
      type: Function as PropType<() => void>
    }
  },
  setup(props, ctx) {
    const walletStore = useWalletStore()
    const chainID = walletStore.chainId
    const sellTokenSymbol = ref()
    const buyTokenSymbol = ref()
    const tokenContract = useErc20Contract()
    const raiseState = ref({
      raiseAmount: 0,
      raiseGoal: 0,
      raisePercent: 0,
      swapAmount: 0
    })

    const logo = computed(() => {
      return getChainInfoByChainId(props.info.chainId)?.logo
    })
    // console.log(props.info.chainId, props.info.crowdfundingContract)
    const fundingContract = useCrowdfundingContract({
      chainId: props.info.chainId!,
      addresses: { [props.info.chainId!]: props.info.crowdfundingContract }
    })

    const getFundingState = async () => {
      // console.log('props.info', props.info)
      if (props.info.chainId == chainID) {
        const fundingContractState = await fundingContract.state('', '')
        raiseState.value.raiseGoal = Number(ethers.utils.formatEther(fundingContractState[0]))
        raiseState.value.raiseAmount = Number(ethers.utils.formatEther(fundingContractState[1]))
        raiseState.value.raisePercent =
          Number(formatToFloor(raiseState.value.raiseAmount / raiseState.value.raiseGoal, 4)) * 100
        raiseState.value.swapAmount = Number(ethers.utils.formatEther(fundingContractState[2]))
      } else {
        raiseState.value.raiseGoal = Number(props.info.raiseGoal)
        raiseState.value.raiseAmount = Number(props.info.raiseBalance)
        console.log(formatToFloor(props.info.raisedPercent, 4))
        raiseState.value.raisePercent = Number(formatToFloor(props.info.raisedPercent, 4))
        raiseState.value.swapAmount = Number(props.info.swapPercent)
      }
    }

    const buyIsMainCoin = computed(() => {
      return props.info.sellTokenAddress === props.info.buyTokenAddress
    })
    // get buy token and sell token
    const getTokenName = async () => {
      if (props.info.chainId == chainID) {
        const sellRes = await tokenContract(props.info.sellTokenAddress)
        sellTokenSymbol.value = await sellRes.symbol()

        if (buyIsMainCoin.value) {
          buyTokenSymbol.value = getChainInfoByChainId(props.info.chainId)?.currencySymbol
        } else {
          const buyTokenRes = await tokenContract(props.info.buyTokenAddress)
          buyTokenSymbol.value = await buyTokenRes.symbol()
        }
      } else {
        sellTokenSymbol.value = props.info.sellTokenSymbol
        buyTokenSymbol.value = props.info.buyTokenSymbol
      }
    }

    const Time = computed(() => {
      if (props.info.status === CrowdfundingStatus.CANCELED) {
        return <div class="text-color3">Canceled</div>
      }
      if (dayjs().isAfter(props.info.endTime)) {
        return <div class="text-color3">Ended</div>
      }

      if (dayjs.utc().isBefore(dayjs(props.info.startTime).utc())) {
        const [days, hours, minutes, seconds] = dayjs
          .duration(dayjs(props.info.startTime).diff(dayjs.utc().utc()))
          .format('DD-HH-mm-ss')
          .split('-')
        return (
          <div class="flex items-center">
            <span class="flex-1">Starts In：</span>
            <span class="text-primary">
              {days}:{hours}:{minutes}:{seconds}
            </span>
          </div>
        )
      }

      const [days, hours, minutes, seconds] = dayjs
        .duration(dayjs(props.info.endTime).utc().diff(dayjs.utc()))
        .format('DD-HH-mm-ss')
        .split('-')
      return (
        <div class="flex items-center">
          <span class="flex-1">Ends In：</span>
          <span class="text-primary">
            {days}:{hours}:{minutes}:{seconds}
          </span>
        </div>
      )
    })

    onMounted(() => {
      getTokenName()
      getFundingState()
    })

    return () => (
      <div
        class="bg-white border border-color-border rounded-sm cursor-pointer font-primary top-0 overflow-hidden relative hover:bg-color-hover"
        style="transition:all ease .3s"
        onClick={() => props.onClick?.()}
      >
        <UTag type="filled" bgColor="#fff" class="top-4 right-4 absolute !text-color2">
          {CROWDFUNDING_TYPES[props.info.status - 1]}
        </UTag>
        <ULazyImage src={props.info.poster} class=" h-10.75rem w-full" />
        <div class="p-6">
          <div class="flex mb-2 items-center">
            <span class="flex-1 mr-4 text-color1 truncate u-h3">{props.info.startupName}</span>
            <img src={logo.value} />
          </div>
          <div class="flex mb-2">
            <div class="flex-1 text-0.75rem">
              <div class="text-grey3  leading-6">Raise Goal </div>
              <div class="text-primary">
                <span class="mr-1 u-h3">{raiseState.value.raiseGoal}</span>
                <span class="u-h7">{buyTokenSymbol.value}</span>
              </div>
            </div>
            {props.info.kyc && <UTag class="mr-1 ">KYC</UTag>}
            {props.info.contractAudit && <UTag>AUDIT</UTag>}
          </div>

          <UProgress
            showIndicator={false}
            percentage={raiseState.value.raisePercent}
            color="#00BFA5"
            height={6}
            class="mb-2"
          />

          <div class="flex mb-2 items-center">
            <div class="flex-1 u-h7">
              <span class="text-color1">{raiseState.value.raiseAmount}</span>
              <span class="ml-1 text-color3">{buyTokenSymbol.value}</span>
            </div>
            <div class="text-right text-color1 u-num2">{raiseState.value.raisePercent} %</div>
          </div>
          <div class="flex mt-3 justify-between u-h6">
            <span class="text-color3">Rate:</span>
            <span class="text-right text-color1">
              1 {buyTokenSymbol.value} = {props.info.buyPrice} {sellTokenSymbol.value}
            </span>
          </div>
          <div class="flex mt-2 justify-between ">
            <span class="text-color3">Swap %:</span>
            <span class="text-right text-color1">{props.info.swapPercent} %</span>
          </div>
        </div>
        <div class="border-color-border border-t-1 py-3 px-6 text-color3 u-h6">{Time.value}</div>
      </div>
    )
  }
})
