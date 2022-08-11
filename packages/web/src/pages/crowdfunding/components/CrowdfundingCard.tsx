import { ULazyImage, UTag, UProgress } from '@comunion/components'
import dayjs from 'dayjs'
import { format } from 'timeago.js'
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
    const sellTokenName = ref()
    const buyTokenName = ref()
    const tokenContract = useErc20Contract()
    const logo = computed(() => {
      return getChainInfoByChainId(props.info.chainId)?.logo
    })
    // get buy token and sell token
    const getTokenName = async () => {
      console.log('props.info.sellTokenAddress==>', props.info.sellTokenAddress)

      const sellRes = await tokenContract(props.info.sellTokenAddress)
      sellTokenName.value = await sellRes.name()
      console.log('sellTokenName.value ==>', sellTokenName.value)

      if (props.info.sellTokenAddress === props.info.buyTokenAddress) {
        buyTokenName.value = getChainInfoByChainId(props.info.chainId)?.currencySymbol
      } else {
        const buyTokenRes = await tokenContract(props.info.buyTokenAddress)
        buyTokenName.value = await buyTokenRes.name()
      }
    }

    const Time = computed(() => {
      if (props.info.status === CrowdfundingStatus.CANCELED) {
        return <div class="u-body2">Crowdfunding Canceled</div>
      }
      if (dayjs().isBefore(dayjs(props.info.startTime))) {
        return <div>Crowdfunding Starts In：{format('DD:HH:mm:ss')}</div>
      }
      if (dayjs().isAfter(props.info.endTime)) {
        return <div class="u-body2">Crowdfunding Ended</div>
      }
      return <div>Crowdfunding Ends In：{format('DD:HH:mm:ss')}</div>
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
              <span class="text-grey3">{buyTokenName.value}</span>
            </div>
            <div>
              <span class="text-grey3">Raise Goal: </span>{' '}
              <span class="text-primary">
                {props.info.raiseGoal} {buyTokenName.value}
              </span>
            </div>
          </div>
          <div class="mt-6 u-body2">
            <span class="text-grey2">IBO Rate:</span>
            <span></span>
          </div>
          <div class="mt-2 u-body2">
            <span class="text-grey2">Swap %:</span>
            <span></span>
          </div>
        </div>
        <div class="w-full h-px bg-purple"></div>
        <div class="pl-6 py-4">{Time.value}</div>
      </div>
    )
  }
})
