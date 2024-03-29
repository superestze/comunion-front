import { UCard, UProgress } from '@comunion/components'
import { defineComponent, PropType } from 'vue'
import { ServiceReturn } from '@/services'

export const CurrentResult = defineComponent({
  name: 'CurrentResult',
  props: {
    proposalInfo: {
      type: Object as PropType<NonNullable<ServiceReturn<'governance@get-proposal-detail'>>>,
      required: true
    },
    voteSymbol: {
      type: String,
      required: true
    }
  },
  render() {
    return (
      <UCard title="Current results">
        {(this.proposalInfo.choiceVoteInfos || []).map(choiceOption => (
          <div>
            <div class="flex mb-2 justify-between u-h6">
              <span>{choiceOption.itemName}</span>
              <span class="text-color3">
                {choiceOption.votes}
                <span class="mx-2">{this.voteSymbol}</span> {Number(choiceOption.percent) * 100}%
              </span>
            </div>
            <UProgress
              color="#5331F4"
              showIndicator={false}
              percentage={Number(choiceOption.percent) * 100}
              height={8}
              class="mb-4"
            />
          </div>
        ))}
      </UCard>
    )
  }
})
