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
      <UCard class="!p-6" contentStyle={{ paddingTop: 0 }}>
        <div class="u-card-title2 mb-9">Current results</div>
        {(this.proposalInfo.choiceVoteInfos || []).map(choiceOption => (
          <div>
            <div class="flex justify-between mb-1">
              <span>{choiceOption.itemName}</span>
              <span>
                {choiceOption.votes}
                <span class="mx-2">{this.voteSymbol}</span> {Number(choiceOption.percent) * 100}%
              </span>
            </div>
            <UProgress
              showIndicator={false}
              percentage={Number(choiceOption.percent) * 100}
              height={6}
              class="mb-4"
            />
          </div>
        ))}
      </UCard>
    )
  }
})
