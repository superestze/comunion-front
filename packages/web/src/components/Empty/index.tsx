import { UNoContent } from '@comunion/components'
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
      <UNoContent textTip="No connect yet" class="my-10">
        <EmptyFilled class="-mb-14" />
      </UNoContent>
    )
  }
})
