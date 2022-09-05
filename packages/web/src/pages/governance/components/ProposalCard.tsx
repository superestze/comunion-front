import { UStartupLogo } from '@comunion/components'
import dayjs from 'dayjs'
import { defineComponent, PropType, computed } from 'vue'
import { GOVERNANCE_KEY } from '../utils'
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
    const mulStatusStyle = {
      1: 'px-3 bg-primary',
      2: 'px-3 bg-[#00BFA5]',
      3: 'px-3 bg-warning',
      4: 'px-3 bg-grey5'
    }
    const statusStyle = computed(() => {
      return mulStatusStyle[props.proposalData.status as keyof typeof mulStatusStyle]
    })

    const timeTip = computed(() => {
      if (props.proposalData.status === 1) {
        const [days, hours, minutes] = dayjs
          .duration(dayjs(props.proposalData.startTime).utc().diff(dayjs.utc()))
          .format('DD-HH-mm')
          .split('-')
        const basePrefix = 'Starts in '
        if (days) return basePrefix + days + 'days'
        if (hours) return basePrefix + days + 'hours'
        if (minutes) return basePrefix + minutes + 'minutes'
      } else if (props.proposalData.status === 3) {
        return (
          <div>
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
      <div class="flex bg-white py-8 px-10 w-full">
        <div class="w-15 h-15">
          <UStartupLogo class="mr-2" src="" width="60" height="60" />
        </div>
        <div>
          <div class="flex items-center">
            <span class="mr-2">Linkedin by</span>
            <span>{this.proposalData.authorWalletAddress}</span>
            <div class={['status ml-auto', this.statusStyle]}>
              {GOVERNANCE_KEY[this.proposalData.status as keyof typeof GOVERNANCE_KEY]}
            </div>
          </div>
          <div class="u-title3 truncate break-all max-w-200 my-2">{this.proposalData.title}</div>
          <div class="u-body2 truncate break-all whitespace-pre-line line-clamp-2">
            {this.proposalData.description}
          </div>
          <div class="text-grey3  mt-2">{this.timeTip}</div>
        </div>
      </div>
    )
  }
})
