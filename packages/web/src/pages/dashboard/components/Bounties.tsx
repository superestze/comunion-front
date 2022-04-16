import { UCard, UDeveloping, UTabPane, UTabs } from '@comunion/components'
import { defineComponent } from 'vue'

const Bounties = defineComponent({
  name: 'Bounties',
  setup(prop, ctx) {
    return () => (
      <UCard title="BOUNTIES" size="small" class="p-10 font-700 font-4 leading-6 tracking-2px">
        <UTabs>
          <UTabPane name="HUNTES" tab="HUNTES">
            <UDeveloping />
          </UTabPane>
          <UTabPane name="POSTED BY ME" tab="POSTED BY ME">
            <UDeveloping />
          </UTabPane>
        </UTabs>
      </UCard>
    )
  }
})

export default Bounties
