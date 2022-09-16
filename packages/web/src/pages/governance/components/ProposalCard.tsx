import { UStartupLogo } from '@comunion/components'
import { ConfirmOutlined } from '@comunion/icons'
import { shortenAddress } from '@comunion/utils'
import dayjs from 'dayjs'
import { defineComponent, PropType, computed } from 'vue'
import { useRouter } from 'vue-router'
import { GOVERNANCE_KEY, GOVERNANCE_STATUS_STYLE } from '../utils'
import { ServiceReturn } from '@/services'

export const ProposalCard = defineComponent({
  name: 'ProposalCard',
  props: {
    proposalData: {
      type: Object as PropType<
        NonNullable<ServiceReturn<'governance@public-list'>>['rows'][number]
      >,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()

    const statusStyle = computed(() => {
      return GOVERNANCE_STATUS_STYLE[
        props.proposalData.status as keyof typeof GOVERNANCE_STATUS_STYLE
      ]
    })

    const timeTip = computed(() => {
      if (props.proposalData.status === 1) {
        const [days, hours, minutes] = dayjs
          .duration(dayjs(props.proposalData.startTime).utc().diff(dayjs.utc()))
          .format('DD-HH-mm')
          .split('-')
        const basePrefix = 'Starts in '

        if (Number(days)) {
          return basePrefix + days + ' days'
        }
        if (Number(hours)) {
          return basePrefix + hours + ' hours'
        }
        if (Number(minutes)) {
          return basePrefix + minutes + ' minutes'
        }
      } else if (props.proposalData.status === 3) {
        return (
          <div class="flex items-center">
            <ConfirmOutlined class="h-4 text-primary mr-2 w-4" />{' '}
            {props.proposalData.maximumVotesChoice} -- {props.proposalData.votes}
          </div>
        )
      }
      return null
    })
    const toComerDetail = (e: Event) => {
      e.stopPropagation()
      router.push({ path: '/comer', query: { id: props.proposalData.authorComerId } })
    }
    const handleCard = () => {
      router.push(`/governance/${props.proposalData.proposalId}`)
    }

    return {
      statusStyle,
      timeTip,
      toComerDetail,
      handleCard
    }
  },
  render() {
    return (
      <div
        class="bg-white rounded-sm cursor-pointer flex border-1 mb-6 py-6 px-6 hover:bg-color-hover"
        onClick={() => this.handleCard()}
      >
        <div class="h-15 mr-4 w-15">
          <UStartupLogo src={this.proposalData.startupLogo || ''} width="15" height="15" />
        </div>
        <div class="flex-1 truncate">
          <div class="flex items-center">
            <div>
              <span class="mr-2 text-xs text-color3">{this.proposalData.startupName} by</span>
              <span class="text-xs text-color2" onClick={this.toComerDetail}>
                {shortenAddress(this.proposalData.authorWalletAddress)}
              </span>
            </div>
            {/* , this.statusStyle */}
            <div
              class={[
                'status rounded-[2px] h-5 font-primary text-color2 ml-4 px-2 text-xs leading-1.25rem inline-block border-1 border-[#DADCE0]'
              ]}
            >
              {GOVERNANCE_KEY[this.proposalData.status as keyof typeof GOVERNANCE_KEY]}
            </div>
          </div>
          <div class="max-w-full mt-2 mb-1 truncate break-all u-h4">{this.proposalData.title}</div>
          {this.proposalData.description && (
            <div
              class="text-xs text-color3 truncate break-all whitespace-pre-line line-clamp-2"
              v-html={this.proposalData.description}
            />
          )}
          {this.timeTip && <div class="mt-2  text-grey3">{this.timeTip}</div>}
        </div>
      </div>
    )
  }
})
