import { UDeveloping } from '@comunion/components'
import { EmptyFilled } from '@comunion/icons'
import { defineComponent } from 'vue'

export default defineComponent({
  render() {
    return (
      <div class="bg-white rounded-lg border mb-6 relative overflow-hidden min-h-205.5 flex items-center justify-center">
        <div class="mx-10 my-9.5">
          <UDeveloping>
            <EmptyFilled />
          </UDeveloping>
        </div>
      </div>
    )
  }
})
