import { UCard, UTabPane, UTabs, UDeveloping } from '@comunion/components'
import { EmptyFilled } from '@comunion/icons'
import { defineComponent } from 'vue'

const Bookmarks = defineComponent({
  name: 'Proposal',
  setup(props, ctx) {
    return () => (
      <UCard title="BOOKMARKS">
        <UTabs>
          <UTabPane name="STARTUPS" tab="STARTUPS">
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

export default Bookmarks
