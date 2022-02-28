import USwitch from '@/comps/USwitch'
import { defineComponent } from 'vue'

const SwitchDemoPage = defineComponent({
  name: 'SwitchDemoPage',
  setup() {
    return () => <USwitch />
  }
})

export default SwitchDemoPage
