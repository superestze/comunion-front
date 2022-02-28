import UDatePicker from '@/comps/UDatePicker'
import { defineComponent } from 'vue'

const DatePickerDemoPage = defineComponent({
  name: 'DatePickerDemoPage',
  setup() {
    return () => <UDatePicker />
  }
})

export default DatePickerDemoPage
