import { UCard, UDeveloping, UTabPane, UTabs } from '@comunion/components'
import { EmptyFilled } from '@comunion/icons'
import { defineComponent } from 'vue'

const Proposals = defineComponent({
  name: 'Proposal',
  setup(props, ctx) {
    return () => (
      <UCard title="PROPOSALS" size="small" class="p-10 font-700 font-4 leading-6 tracking-2px">
        <UTabs>
          <UTabPane name="PARTICIPATED" tab="PARTICIPATED">
            <UDeveloping>
              <EmptyFilled class="mt-34" />
            </UDeveloping>
          </UTabPane>
          <UTabPane name="POSTED BY ME" tab="POSTED BY ME">
            <UDeveloping>
              <EmptyFilled class="mt-34" />
            </UDeveloping>
          </UTabPane>
        </UTabs>
      </UCard>
    )
  }
})

export default Proposals
