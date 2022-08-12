import { ULazyImage, UTag, UProgress } from '@comunion/components'
import dayjs from 'dayjs'
import { defineComponent, PropType, computed, ref, onMounted } from 'vue'
import { CrowdfundingStatus, getChainInfoByChainId } from '../utils'
import { useErc20Contract } from '@/contracts'
import { ServiceReturn } from '@/services'

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
    const logo = computed(() => {
      return getChainInfoByChainId(props.info.chainId)?.logo
    })

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
        return <div class="u-body2">Crowdfunding Canceled</div>
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
        return <div class="u-body2">Crowdfunding Ended</div>
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

    onMounted(() => {
      getTokenName()
    })

    return () => (
      <div class="rounded-lg bg-white">
        <ULazyImage src={props.info.poster} class="h-54 w-full" />
        <div class="p-6">
          <div class="flex justify-between">
            <span class="u-h3">{props.info.startupName}</span>
            <img src={logo.value} />
          </div>
          <div>
            {props.info.kyc && (
              <UTag
                class="u-body3 mr-1"
                type="filled"
                bgColor="#EC53A4"
                style={{
                  'font-weight': '700',
                  'font-size': '14px'
                }}
              >
                KYC
              </UTag>
            )}
            {props.info.contractAudit && (
              <UTag
                class="u-body3 mr-1"
                type="filled"
                bgColor="#5331F4"
                style={{
                  'font-weight': '700',
                  'font-size': '14px'
                }}
              >
                AUDIT
              </UTag>
            )}
          </div>
          <div class="text-right mb-2 u-body3 text-sm">{props.info.raisedPercent * 100} %</div>
          <div>
            <UProgress
              showIndicator={false}
              percentage={props.info.raisedPercent * 100}
              height={6}
            />
          </div>
          <div class="flex justify-between mt-2 text-xs">
            <div>
              <span>{props.info.raiseBalance}</span>{' '}
              <span class="text-grey3">{buyTokenSymbol.value}</span>
            </div>
            <div>
              <span class="text-grey3">Raise Goal: </span>{' '}
              <span class="text-primary">
                {props.info.raiseGoal} {buyTokenSymbol.value}
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
