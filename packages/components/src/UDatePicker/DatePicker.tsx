import type { DatePickerProps } from 'naive-ui'
import { NDatePicker } from 'naive-ui'
import { defineComponent, PropType } from 'vue'

export type UDatePickerPropsType = DatePickerProps

const UDatePicker = defineComponent({
  name: 'UDatePicker',
  extends: NDatePicker,
  props: {
    size: {
      type: String as PropType<DatePickerProps['size']>,
      default: 'large'
    }
  },
  setup(props, ctx) {
    return () => <NDatePicker {...props} v-slots={ctx.slots} />
  }
})

export default UDatePicker
