import UDescription from '@/comps/UDescription'
import { defineComponent } from 'vue'

const DescriptionDemoPage = defineComponent({
  name: 'DescriptionDemoPage',
  setup() {
    return () => <UDescription items={[]} />
  }
})

export default DescriptionDemoPage
