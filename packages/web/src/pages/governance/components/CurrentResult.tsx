import { UCard, UProgress } from '@comunion/components'
import { defineComponent, PropType } from 'vue'
import { ServiceReturn } from '@/services'

export const CurrentResult = defineComponent({
  name: 'CurrentResult',
  props: {
    proposalInfo: {
      type: Object as PropType<NonNullable<ServiceReturn<'governance@get-proposal-detail'>>>,
      required: true
    }
  },
  render() {
    return (
      <UCard title="CURRENT RESULTS">
        {(this.proposalInfo.choiceVoteInfos || []).map(choiceOption => (
          <div>
            <div class="flex justify-between">
              <span>{choiceOption.itemName}</span>
              <span>
                {choiceOption.votes} {choiceOption.percent}%
              </span>
            </div>
            <UProgress
              showIndicator={false}
              percentage={choiceOption.percent}
              height={6}
              class="mb-4"
            />
          </div>
        ))}
      </UCard>
    )
  }
})
