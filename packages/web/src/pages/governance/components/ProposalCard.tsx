import { UStartupLogo } from '@comunion/components'
import { ConfirmOutlined } from '@comunion/icons'
import { shortenAddress } from '@comunion/utils'
import dayjs from 'dayjs'
import { defineComponent, PropType, computed } from 'vue'
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
    return {
      statusStyle,
      timeTip
    }
  },
  render() {
    return (
      <div class="bg-white rounded-lg flex border-grey5 mb-6 w-full py-6">
        <div class="h-15 mr-4 w-15">
          <UStartupLogo src={this.proposalData.startupLogo || ''} width="15" height="15" />
        </div>
        <div class="flex-1 truncate">
          <div class="flex items-center justify-between">
            <div>
              <span class="mr-2 text-xs text-grey3">Linkedin by</span>
              <span class="text-primary text-xs">
                {shortenAddress(this.proposalData.authorWalletAddress)}
              </span>
            </div>
            <div class={['status ml-auto', this.statusStyle]}>
              {GOVERNANCE_KEY[this.proposalData.status as keyof typeof GOVERNANCE_KEY]}
            </div>
          </div>
          <div class="max-w-full my-2 truncate break-all u-title3">{this.proposalData.title}</div>
          {this.proposalData.description && (
            <div
              class="truncate break-all whitespace-pre-line u-body2 line-clamp-2"
              v-html={this.proposalData.description}
            />
          )}
          {this.timeTip && <div class="mt-2  text-grey3">{this.timeTip}</div>}
        </div>
      </div>
    )
  }
})
