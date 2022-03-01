import { UEllipsis } from '@/comps/index'
import { defineComponent } from 'vue'

const EllipsisDemoPage = defineComponent({
  name: 'EllipsisDemoPage',
  setup() {
    return () => (
      <UEllipsis class="!max-w-40">
        Long long long long long long long long long long long long long long long long long long
        long long long long long long long long long long long long long long long paragraph
      </UEllipsis>
    )
  }
})

export default EllipsisDemoPage
