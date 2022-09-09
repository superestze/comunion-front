import { UCard, UDeveloping } from '@comunion/components'
import { EmptyFilled } from '@comunion/icons'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    createdByMe: {
      type: Boolean,
      default: () => true
    }
  },
  render() {
    return (
      <UCard title="dCROWDFUNDING" class="mb-6">
        <UDeveloping>
          <EmptyFilled />
        </UDeveloping>
      </UCard>
    )
  }
})
