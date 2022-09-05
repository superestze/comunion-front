import { UDeveloping } from '@comunion/components'
import { EmptyFilled } from '@comunion/icons'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    startupId: {
      type: String,
      required: true
    }
  },
  render() {
    return (
      <div class="bg-white border rounded-lg flex mb-6 min-h-205.5 relative  overflow-hidden items-center justify-center">
        <div class="my-9.5 mx-10">
          <UDeveloping>
            <EmptyFilled />
          </UDeveloping>
        </div>
      </div>
    )
  }
})
