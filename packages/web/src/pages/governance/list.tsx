import { UDeveloping } from '@comunion/components'
import { EmptyFilled } from '@comunion/icons'
import { defineComponent } from 'vue'

const GovernanceListPage = defineComponent({
  name: 'GovernanceListPage',
  setup() {
    return () => (
      <div class="flex flex-col pt-48 items-center justify-center">
        <UDeveloping>
          <EmptyFilled class="h-36" />
        </UDeveloping>
      </div>
    )
  }
})

export default GovernanceListPage
