import { NDatePicker } from 'naive-ui'
import { defineComponent } from 'vue'

const UDatePicker = defineComponent({
  name: 'UDatePicker',
  extends: NDatePicker,
  setup(props, ctx) {
    return () => <NDatePicker {...props} v-slots={ctx.slots} />
  }
})

export default UDatePicker
