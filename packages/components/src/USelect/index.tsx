import { NSelect } from 'naive-ui'
import { defineComponent } from 'vue'

const USelect = defineComponent({
  name: 'USelect',
  extends: NSelect,
  setup(props, ctx) {
    return () => <NSelect {...props}>{ctx.slots.default?.()}</NSelect>
  }
})

export default USelect
