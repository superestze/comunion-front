import { ULazyImage, UTag, UProgress } from '@comunion/components'
import dayjs from 'dayjs'
import { ethers } from 'ethers'
import { defineComponent, PropType, computed, ref, onMounted } from 'vue'
import { CrowdfundingStatus } from '../utils'
import { CROWDFUNDING_TYPES } from '@/constants'
import { useErc20Contract, useCrowdfundingContract } from '@/contracts'
import { ServiceReturn } from '@/services'
import { useWalletStore } from '@/stores'
import { getChainInfoByChainId } from '@/utils/etherscan'
import { formatToFloor } from '@/utils/numberFormat'

export const CrowdfundingCard = defineComponent({
  name: 'CrowdfundingCard',
  props: {
    info: {
      type: Object as PropType<
        NonNullable<ServiceReturn<'crowdfunding@public-crowdfunding-list'>>['rows'][number]
      >,
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
        raiseState.value.raisePercent = Number(props.info.raisedPercent)
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
        return <div class="text-grey4 u-body2">Canceled</div>
      }
      if (dayjs().isAfter(props.info.endTime)) {
        return <div class="text-grey4 u-body2">Ended</div>
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

    const getStatusLabelStyle = computed(() => {
      const statusClassMap = {
        [CrowdfundingStatus.UPCOMING]: 'bg-success ',
        [CrowdfundingStatus.LIVE]: 'bg-[#00BFA5] ',
        [CrowdfundingStatus.ENDED]: 'bg-warning',
        [CrowdfundingStatus.CANCELED]: 'bg-grey5'
      }
      return statusClassMap[props.info.status as keyof typeof statusClassMap]
    })

    onMounted(() => {
      getTokenName()
      getFundingState()
    })

    return () => (
      <div
        class="bg-white rounded-lg cursor-pointer top-0 relative hover:shadow-md hover:-top-0.5rem"
        style="transition:all ease .3s"
        onClick={() => props.onClick?.()}
      >
        <div
          class={[
            getStatusLabelStyle.value,
            'absolute top-4 right-4 h-1.25rem leading-1.125rem px-2 rounded-sm text-xs text-white border-1 border-white'
          ]}
        >
          {CROWDFUNDING_TYPES[props.info.status - 1]}
        </div>
        <ULazyImage src={props.info.poster} class="rounded-t-lg h-10.75rem w-full" />
        <div class="p-6">
          <div class="flex mb-2 items-center">
            <span class="flex-1 mr-4 truncate u-h3">{props.info.startupName}</span>
            <img src={logo.value} />
          </div>
          <div class="flex mb-2">
            <div class="flex-1 text-0.75rem">
              <div class="text-grey3  leading-6">Raise Goal </div>
              <div class="text-primary ">
                <strong class="mr-1 text-1.25rem" style="font-family: Orbitron,sans-serif;">
                  {raiseState.value.raiseGoal}
                </strong>
                <strong>{buyTokenSymbol.value}</strong>
              </div>
            </div>
            {props.info.kyc && (
              <UTag class="font-semibold text-xs mr-1 !h-5" type="filled" bgColor="#EC53A4">
                KYC
              </UTag>
            )}
            {props.info.contractAudit && (
              <UTag class="font-semibold text-xs mr-1 !h-5" type="filled" bgColor="#5331F4">
                AUDIT
              </UTag>
            )}
          </div>

          <UProgress
            showIndicator={false}
            percentage={raiseState.value.raisePercent}
            height={6}
            class="mb-1"
          />

          <div class="flex text-xs mb-2 items-center">
            <div class="flex-1 text-0.75rem">
              {raiseState.value.raiseAmount}
              <span class="ml-1 text-grey3">{buyTokenSymbol.value}</span>
            </div>
            <div class="text-right text-sm mb-2 u-body3">{raiseState.value.raisePercent} %</div>
          </div>
          <div class="flex mt-3 justify-between u-body2">
            <span class="text-grey2">IBO Rate:</span>
            <span class="text-right">
              1 {buyTokenSymbol.value} = {props.info.buyPrice} {sellTokenSymbol.value}
            </span>
          </div>
          <div class="flex mt-2 justify-between u-body2">
            <span class="text-grey2">Swap %:</span>
            <span class="text-right">{props.info.swapPercent} %</span>
          </div>
        </div>
        <div class="bg-purple h-px w-full"></div>
        <div class="border-purple border-t-1 py-3 px-6">{Time.value}</div>
      </div>
    )
  }
})
