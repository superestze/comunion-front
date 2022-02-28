import USelect from '@/comps/USelect'
import { defineComponent } from 'vue'

const SelectDemoPage = defineComponent({
  name: 'SelectDemoPage',
  setup() {
    return () => <USelect></USelect>
  }
})

export default SelectDemoPage
