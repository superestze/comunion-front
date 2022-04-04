import { UCard, UDeveloping, UTabPane, UTabs } from '@comunion/components'
import { defineComponent } from 'vue'

const Proposals = defineComponent({
  name: 'Proposal',
  setup(props, ctx) {
    return () => (
      <UCard title="MY PROPOSALS" size="small" class="p-10 font-700 font-4 leading-6 tracking-2px">
        <UTabs>
          <UTabPane name="WHAT I PARTICIPATED" tab="WHAT I PARTICIPATED">
            <UDeveloping />
          </UTabPane>
          <UTabPane name="INITIATED BY ME" tab="INITIATED BY ME">
            <UDeveloping />
          </UTabPane>
        </UTabs>
      </UCard>
    )
  }
})

export default Proposals
