import { UTag } from '@comunion/components'
import { ConfirmOutlined } from '@comunion/icons'
import dayjs from 'dayjs'
import { defineComponent, PropType, computed } from 'vue'
import { useRouter } from 'vue-router'
import { GOVERNANCE_KEY, GOVERNANCE_STATUS_STYLE } from '../utils'
import StartupLogo from '@/components/StartupLogo'
import { ServiceReturn } from '@/services'

export const ProposalCard = defineComponent({
  name: 'ProposalCard',
  props: {
    proposalData: {
      type: Object as PropType<
        NonNullable<ServiceReturn<'governance@public-list'>>['rows'][number]
      >,
      required: true
    },
    noBorder: {
      type: Boolean,
      default: () => false
    },
    noDescription: {
      type: Boolean,
      default: () => false
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
        class={`bg-white rounded-sm cursor-pointer flex ${
          !this.noDescription ? 'mb-5' : ''
        } py-6 px-6 ${this.noBorder ? '' : 'border-1'} hover:bg-color-hover`}
        onClick={() => this.handleCard()}
      >
        <StartupLogo src={this.proposalData.startupLogo || ''} class="h-15 mr-4 w-15" />
        <div class="flex-1 overflow-hidden">
          <div class="flex items-center">
            <div class="flex-1 text-color3 u-h7">
              {this.proposalData.startupName}
              <span class="px-2">by</span>
              <span class="text-color2 hover:text-primary" onClick={this.toComerDetail}>
                {this.proposalData.authorComerName}
              </span>
            </div>
            {/* , this.statusStyle */}
            <UTag>{GOVERNANCE_KEY[this.proposalData.status as keyof typeof GOVERNANCE_KEY]}</UTag>
          </div>
          <div class="mt-2 mb-1 max-w-9/10 text-color1 truncate u-h4">
            {this.proposalData.title}
          </div>
          {!this.noDescription && this.proposalData.description && (
            <div class="text-color2 u-h6 line-clamp-2" v-html={this.proposalData.description} />
          )}
          {this.timeTip && <div class="mt-2 text-color3 u-h7">{this.timeTip}</div>}
        </div>
      </div>
    )
  }
})
