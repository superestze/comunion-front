import { UCard, UTabPane, UTabs, UDeveloping } from '@comunion/components'
import { defineComponent } from 'vue'

const Bookmarks = defineComponent({
  name: 'Proposal',
  setup(props, ctx) {
    return () => (
      <UCard title="BOOKMARKS" size="small" class="p-10 font-700 font-4 leading-6 tracking-2px">
        <UTabs>
          <UTabPane name="STARTUPS" tab="STARTUPS">
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

export default Bookmarks
