import type { DatePickerProps } from 'naive-ui'
import { NDatePicker } from 'naive-ui'
import { DefineComponent, defineComponent } from 'vue'

export type UDatePickerPropsType = DatePickerProps

const UDatePicker: DefineComponent<UDatePickerPropsType> = defineComponent({
  name: 'UDatePicker',
  extends: NDatePicker,
  setup(props, ctx) {
    return () => <NDatePicker {...props} v-slots={ctx.slots} />
  }
})

export default UDatePicker
