import { NDropdown } from 'naive-ui'
import { defineComponent } from 'vue'

const UDropdown = defineComponent({
  name: 'UDropdown',
  extends: NDropdown,
  setup(props, ctx) {
    return () => <NDropdown {...props}>{ctx.slots.default?.()}</NDropdown>
  }
})

export default UDropdown
