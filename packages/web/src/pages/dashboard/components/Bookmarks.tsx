import { UCard, UTabPane, UTabs, UDeveloping } from '@comunion/components'
import { defineComponent } from 'vue'

const Bookmarks = defineComponent({
  name: 'Proposal',
  setup(props, ctx) {
    return () => (
      <UCard title="MY BOOKMARKS" size="small" class="p-10 font-700 font-4 leading-6 tracking-2px">
        <UTabs>
          <UTabPane name="COMEUPS" tab="COMEUPS">
            <UDeveloping />
          </UTabPane>
          <UTabPane name="BOUNTIES" tab="BOUNTIES">
            <UDeveloping />
          </UTabPane>
          <UTabPane name="COMERS" tab="COMERS">
            <UDeveloping />
          </UTabPane>
        </UTabs>
      </UCard>
    )
  }
})

export default Bookmarks
