import { NDropdown } from 'naive-ui'
import { defineComponent } from 'vue'

const UDropdown = defineComponent({
  name: 'UDropdown',
  extends: NDropdown,
  setup(props, ctx) {
    return () => <NDropdown {...props} v-slots={ctx.slots} />
  }
})

export default UDropdown
