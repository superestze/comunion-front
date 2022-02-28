import UEllipsis from '@/comps/UEllipsis'
import { defineComponent } from 'vue'

const EllipsisDemoPage = defineComponent({
  name: 'EllipsisDemoPage',
  setup() {
    return () => <UEllipsis />
  }
})

export default EllipsisDemoPage
