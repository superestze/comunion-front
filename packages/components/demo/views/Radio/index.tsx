import URadio from '@/comps/URadio'
import { defineComponent } from 'vue'

const RadioDemoPage = defineComponent({
  name: 'RadioDemoPage',
  setup() {
    return () => <URadio />
  }
})

export default RadioDemoPage
