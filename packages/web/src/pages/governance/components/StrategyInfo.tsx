import { UCard } from '@comunion/components'
import { UrlOutlined } from '@comunion/icons'
import dayjs from 'dayjs'
import { defineComponent, PropType, computed } from 'vue'
import { ServiceReturn } from '@/services'

export const StrategyInformation = defineComponent({
  name: 'StrategyInformation',
  props: {
    proposalInfo: {
      type: Object as PropType<ServiceReturn<'governance@get-proposal-detail'>>,
      required: true
    },
    blockExploreUrl: {
      type: String
    }
  },
  emits: ['showStrategyDetail'],
  setup(props) {
    const strategy = computed(() => {
      return props.proposalInfo?.strategies?.[props.proposalInfo?.strategies.length - 1]
    })

    return {
      strategy
    }
  },
  render() {
    return (
      <UCard contentStyle={{ paddingTop: 0 }} class="!p-6">
        <div>
          <div class="u-card-title2 mb-9">Information</div>
          <div class="grid grid-cols-2 gap-y-4 justify-between y-body2">
            <div class="text-grey3">Strategie(s) :</div>
            <div
              class={[
                'text-right',
                { 'text-primary cursor-pointer': this.strategy?.dictValue !== 'ticket' }
              ]}
              onClick={() =>
                this.strategy?.dictValue === 'ticket' ? null : this.$emit('showStrategyDetail')
              }
            >
              {this.strategy?.strategyName}
            </div>
            <div class="text-grey3">Voting system :</div>
            <div class="text-right">{this.proposalInfo?.voteSystem}</div>
            <div class="text-grey3">Start date :</div>
            <div class="text-right">{dayjs(this.proposalInfo?.startTime).utc().format()}</div>
            <div class="text-grey3">End date :</div>
            <div class="text-right">{dayjs(this.proposalInfo?.endTime).utc().format()}</div>
            <div class="text-grey3">Block height :</div>
            <div class="flex justify-end items-center">
              {this.proposalInfo?.blockNumber?.toLocaleString()}
              {this.blockExploreUrl && (
                <a
                  href={`${this.blockExploreUrl}/block/${this.proposalInfo?.blockNumber}`}
                  target="__blank"
                  class="ml-2 leading-4"
                >
                  <UrlOutlined class="text-primary" />
                </a>
              )}
            </div>
          </div>
        </div>
      </UCard>
    )
  }
})
