import { UCard, UDeveloping, UTabPane, UTabs } from '@comunion/components'
import { defineComponent } from 'vue'

const Bounties = defineComponent({
  name: 'Bounties',
  setup(prop, ctx) {
    return () => (
      <UCard title="MY BOUNTIES" size="small" class="p-10 font-700 font-4 leading-6 tracking-2px">
        <UTabs>
          <UTabPane name="WHAT I SIGNED UP" tab="WHAT I SIGNED UP">
            <UDeveloping />
          </UTabPane>
          <UTabPane name="PUBLISHED BY ME" tab="PUBLISHED BY ME">
            <UDeveloping />
          </UTabPane>
        </UTabs>
      </UCard>
    )
  }
})

export default Bounties
