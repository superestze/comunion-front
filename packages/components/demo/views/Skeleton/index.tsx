import USkeleton from '@/comps/USkeleton'
import { defineComponent } from 'vue'

const SkeletonDemoPage = defineComponent({
  name: 'SkeletonDemoPage',
  setup() {
    return () => <USkeleton />
  }
})

export default SkeletonDemoPage
