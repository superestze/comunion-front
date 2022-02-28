import { NDatePicker } from 'naive-ui'
import { defineComponent } from 'vue'

const UDatePicker = defineComponent({
  name: 'UDatePicker',
  extends: NDatePicker,
  setup(props, ctx) {
    return () => <NDatePicker {...props}>{ctx.slots.default?.()}</NDatePicker>
  }
})

export default UDatePicker
