import { UCard, UDeveloping, UTabPane, UTabs } from '@comunion/components'
import { EmptyFilled } from '@comunion/icons'
import { defineComponent } from 'vue'

const Bounties = defineComponent({
  name: 'Bounties',
  setup(prop, ctx) {
    return () => (
      <UCard title="BOUNTIES">
        <UTabs>
          <UTabPane name="HUNTED" tab="HUNTED">
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

export default Bounties
