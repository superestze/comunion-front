import UEmpty from '@/comps/UEmpty'
import { defineComponent } from 'vue'

const EmptyDemoPage = defineComponent({
  name: 'EmptyDemoPage',
  setup() {
    return () => <UEmpty />
  }
})

export default EmptyDemoPage
