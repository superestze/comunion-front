import { NCheckbox } from 'naive-ui'
import { defineComponent } from 'vue'

const UCheckbox = defineComponent({
  name: 'UCheckbox',
  extends: NCheckbox,
  setup(props, ctx) {
    return () => <NCheckbox {...props} v-slots={ctx.slots} />
  }
})

export default UCheckbox
