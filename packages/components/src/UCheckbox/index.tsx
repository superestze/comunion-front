import { NCheckbox } from 'naive-ui'
import { defineComponent } from 'vue'

const UCheckbox = defineComponent({
  name: 'UCheckbox',
  extends: NCheckbox,
  setup(props, ctx) {
    return () => <NCheckbox {...props}>{ctx.slots.default?.()}</NCheckbox>
  }
})

export default UCheckbox
