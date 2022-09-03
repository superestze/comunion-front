import { UCard } from '@comunion/components'
import { defineComponent } from 'vue'

export const StrategyInformation = defineComponent({
  name: 'StrategyInformation',
  render() {
    return (
      <UCard title="INFORMATION" class="!px-10 !py-8">
        <div class="grid grid-cols-2 gap-4 justify-between mt-3 y-body2">
          <div class="text-grey3">Strategie(s) :</div>
          <div class="text-right">12</div>
          <div class="text-grey3">Strategie(s) :</div>
          <div class="text-right">12</div>
          <div class="text-grey3">Strategie(s) :</div>
          <div class="text-right">12</div>
          <div class="text-grey3">Strategie(s) :</div>
          <div class="text-right">12</div>
        </div>
      </UCard>
    )
  }
})
