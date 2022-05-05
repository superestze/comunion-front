import type { DatePickerProps } from 'naive-ui'
import { NDatePicker } from 'naive-ui'
import { defineComponent } from 'vue'

export type UDatePickerPropsType = DatePickerProps

const UDatePicker = defineComponent({
  name: 'UDatePicker',
  extends: NDatePicker,
  setup(props, ctx) {
    return () => <NDatePicker {...props} v-slots={ctx.slots} />
  }
})

export default UDatePicker
