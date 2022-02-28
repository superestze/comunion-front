import UCheckbox from '@/comps/UCheckbox'
import { defineComponent, ref } from 'vue'

const CheckboxDemoPage = defineComponent({
  name: 'CheckboxDemoPage',
  setup() {
    const v = ref(false)
    return () => <UCheckbox v-model={v.value} />
  }
})

export default CheckboxDemoPage
