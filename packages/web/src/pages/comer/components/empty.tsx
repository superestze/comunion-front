import { UCard, UNoContent } from '@comunion/components'
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
      <UCard title="" class="mb-6">
        <UNoContent textTip="NO ACTIVITIES YET" class="my-10">
          <EmptyFilled />
        </UNoContent>
      </UCard>
    )
  }
})
