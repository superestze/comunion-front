import { UDescription } from '@/comps/index'
import { defineComponent } from 'vue'

const DescriptionDemoPage = defineComponent({
  name: 'DescriptionDemoPage',
  setup() {
    return () => <UDescription items={[]} />
  }
})

export default DescriptionDemoPage
