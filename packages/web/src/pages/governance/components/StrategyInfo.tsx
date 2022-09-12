import { UCard } from '@comunion/components'
import dayjs from 'dayjs'
import { defineComponent, PropType, computed } from 'vue'
import { ServiceReturn } from '@/services'

export const StrategyInformation = defineComponent({
  name: 'StrategyInformation',
  props: {
    proposalInfo: {
      type: Object as PropType<ServiceReturn<'governance@get-proposal-detail'>>,
      required: true
    }
  },
  setup(props) {
    const strategy = computed(() => {
      return props.proposalInfo?.strategies[props.proposalInfo?.strategies.length - 1]
    })

    return {
      strategy
    }
  },
  render() {
    return (
      <UCard title="INFORMATION" class="!px-10 !py-8">
        <div class="grid grid-cols-2 gap-4 justify-between mt-3 y-body2">
          <div class="text-grey3">Strategie(s) :</div>
          <div class="text-right">{this.strategy?.strategyName}</div>
          <div class="text-grey3">Voting system :</div>
          <div class="text-right">{this.proposalInfo?.voteSystem}</div>
          <div class="text-grey3">Start date :</div>
          <div class="text-right">{dayjs(this.proposalInfo?.startTime).utc().format()}</div>
          <div class="text-grey3">End date :</div>
          <div class="text-right">{dayjs(this.proposalInfo?.endTime).utc().format()}</div>
          <div class="text-grey3">Block height :</div>
          <div class="text-right">{this.proposalInfo?.blockNumber}</div>
        </div>
      </UCard>
    )
  }
})
