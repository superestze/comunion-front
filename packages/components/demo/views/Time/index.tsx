import { UTime } from '@/comps/index'
import { defineComponent } from 'vue'

const TimeDemoPage = defineComponent({
  name: 'TimeDemoPage',
  setup() {
    return () => <UTime />
  }
})

export default TimeDemoPage
