import { ULazyImage, UTag, UProgress } from '@comunion/components'
import dayjs from 'dayjs'
import { format } from 'timeago.js'
import { defineComponent, PropType, computed } from 'vue'
import { getChainInfoByChainId } from '../utils'

export const CrowdfundingCard = defineComponent({
  name: 'CrowdfundingCard',
  props: {
    info: {
      type: Object as PropType<{
        poster: string
        startupName: string
        kyc?: string
        contractAudit?: string
        chainId: number
        buyTokenName: string
        raiseGoal: number
        status: string
        startTime: string
        endTime: string
      }>,
      required: true
    }
  },
  setup(props) {
    const logo = computed(() => {
      return getChainInfoByChainId(props.info.chainId)?.logo
    })
    const Time = computed(() => {
      if (props.info.status === 'canceled') {
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
          <div class="text-right"></div>
          <div>
            <UProgress showIndicator={false} />
          </div>
          <div class="flex justify-between">
            <span>{props.info.buyTokenName}</span>
            <span>
              Raise Goal：{props.info.raiseGoal} {props.info.buyTokenName}
            </span>
          </div>
          <div>
            <span>IBO Rate:</span>
            <span></span>
          </div>
          <div>
            <span>Swap %:</span>
            <span></span>
          </div>
        </div>
        <div class="w-full h-px bg-purple"></div>
        <div class="pl-6 py-4">{Time.value}</div>
      </div>
    )
  }
})
