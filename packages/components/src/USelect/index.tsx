import { NSelect } from 'naive-ui'
import { defineComponent } from 'vue'

const USelect = defineComponent({
  name: 'USelect',
  extends: NSelect,
  setup(props, ctx) {
    return () => <NSelect {...props} v-slots={ctx.slots} />
  }
})

export default USelect
