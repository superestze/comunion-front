import { ULazyImage, UTag, UProgress } from '@comunion/components'
import dayjs from 'dayjs'
import { ethers } from 'ethers'
import { defineComponent, PropType, computed, ref, onMounted } from 'vue'
import { CrowdfundingStatus, getChainInfoByChainId } from '../utils'
import { CROWDFUNDING_TYPES } from '@/constants'
import { useErc20Contract, useCrowdfundingContract } from '@/contracts'
import { ServiceReturn } from '@/services'
import { formatToFloor } from '@/utils/numberFormat'

export const CrowdfundingCard = defineComponent({
  name: 'CrowdfundingCard',
  props: {
    info: {
      type: Object as PropType<
        NonNullable<ServiceReturn<'crowdfunding@public-crowdfunding-list'>>['rows'][number]
      >,
      required: true
    }
  },
  setup(props) {
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

    const fundingContract = useCrowdfundingContract({
      chainId: props.info.chainId!,
      addresses: { [props.info.chainId!]: props.info.crowdfundingContract }
    })

    const getFundingState = async () => {
      const fundingContractState = await fundingContract.state('', '')
      raiseState.value.raiseGoal = Number(ethers.utils.formatEther(fundingContractState[0]))
      raiseState.value.raiseAmount = Number(ethers.utils.formatEther(fundingContractState[1]))
      raiseState.value.raisePercent =
        Number(formatToFloor(raiseState.value.raiseAmount / raiseState.value.raiseGoal, 4)) * 100
      raiseState.value.swapAmount = Number(ethers.utils.formatEther(fundingContractState[2]))
    }

    const buyIsMainCoin = computed(() => {
      return props.info.sellTokenAddress === props.info.buyTokenAddress
    })
    // get buy token and sell token
    const getTokenName = async () => {
      const sellRes = await tokenContract(props.info.sellTokenAddress)
      sellTokenSymbol.value = await sellRes.symbol()

      if (buyIsMainCoin.value) {
        buyTokenSymbol.value = getChainInfoByChainId(props.info.chainId)?.currencySymbol
      } else {
        const buyTokenRes = await tokenContract(props.info.buyTokenAddress)
        buyTokenSymbol.value = await buyTokenRes.symbol()
      }
    }

    const Time = computed(() => {
      if (props.info.status === CrowdfundingStatus.CANCELED) {
        return <div class="u-body2 text-grey4">Crowdfunding Canceled</div>
      }
      if (dayjs.utc().isBefore(dayjs(props.info.startTime).utc())) {
        const [days, hours, minutes, seconds] = dayjs
          .duration(dayjs(props.info.startTime).diff(dayjs.utc().utc()))
          .format('DD-HH-mm-ss')
          .split('-')
        return (
          <div class="flex justify-between">
            <span>Crowdfunding Starts In：</span>
            <span class="text-primary">
              {days}:{hours}:{minutes}:{seconds}
            </span>
          </div>
        )
      }
      if (dayjs().isAfter(props.info.endTime)) {
        return <div class="u-body2 text-grey4">Crowdfunding Ended</div>
      }
      const [days, hours, minutes, seconds] = dayjs
        .duration(dayjs(props.info.endTime).utc().diff(dayjs.utc()))
        .format('DD-HH-mm-ss')
        .split('-')
      return (
        <div class="flex justify-between">
          <span>Crowdfunding Ends In：</span>
          <span class="text-primary">
            {days}:{hours}:{minutes}:{seconds}
          </span>
        </div>
      )
    })

    const getStatusLabelStyle = computed(() => {
      const statusClassMap = {
        [CrowdfundingStatus.UPCOMING]:
          'bg-success rounded text-xs text-white py-0.5 px-2.5 border-1 border-white',
        [CrowdfundingStatus.LIVE]:
          'bg-[#00BFA5] rounded text-xs text-white py-0.5 px-2.5 border-1 border-white',
        [CrowdfundingStatus.ENDED]:
          'bg-warning rounded text-xs text-white py-0.5 px-2.5 border-1 border-white',
        [CrowdfundingStatus.CANCELED]:
          'bg-grey5 rounded text-xs text-white py-0.5 px-2.5 border-1 border-white'
      }
      return statusClassMap[props.info.status as keyof typeof statusClassMap]
    })

    onMounted(() => {
      getTokenName()
      getFundingState()
    })

    return () => (
      <div class="relative rounded-lg bg-white">
        <div class={[getStatusLabelStyle.value, 'absolute top-4 right-4']}>
          {CROWDFUNDING_TYPES[props.info.status - 1]}
        </div>
        <ULazyImage src={props.info.poster} class="h-54 w-full rounded-t-lg" />
        <div class="p-6">
          <div class="flex justify-between">
            <span class="u-h3">{props.info.startupName}</span>
            <img src={logo.value} />
          </div>
          <div class="min-h-6">
            {props.info.kyc && (
              <UTag class="text-xs font-semibold mr-1 !h-5" type="filled" bgColor="#EC53A4">
                KYC
              </UTag>
            )}
            {props.info.contractAudit && (
              <UTag class="text-xs font-semibold mr-1 !h-5" type="filled" bgColor="#5331F4">
                AUDIT
              </UTag>
            )}
          </div>
          <div class="text-right mb-2 u-body3 text-sm">{raiseState.value.raisePercent} %</div>
          <div>
            <UProgress
              showIndicator={false}
              percentage={raiseState.value.raisePercent}
              height={6}
            />
          </div>
          <div class="flex justify-between mt-2 text-xs">
            <div>
              <span class="u-label1 text-base">{raiseState.value.raiseAmount}</span>{' '}
              <span class="text-grey3">{buyTokenSymbol.value}</span>
            </div>
            <div class="text-xs">
              <span class="text-grey3">Raise Goal : </span>{' '}
              <span class="text-primary">
                <span class="u-label1 text-primary text-base">{raiseState.value.raiseGoal}</span>{' '}
                {buyTokenSymbol.value}
              </span>
            </div>
          </div>
          <div class="mt-6 u-body2 flex justify-between">
            <span class="text-grey2">IBO Rate:</span>
            <span class="text-right">
              1 {buyTokenSymbol.value} = {props.info.buyPrice} {sellTokenSymbol.value}
            </span>
          </div>
          <div class="mt-2 u-body2 flex justify-between">
            <span class="text-grey2">Swap %:</span>
            <span class="text-right">{props.info.swapPercent} %</span>
          </div>
        </div>
        <div class="w-full h-px bg-purple"></div>
        <div class="px-6 py-4 border-t-1 border-purple">{Time.value}</div>
      </div>
    )
  }
})
