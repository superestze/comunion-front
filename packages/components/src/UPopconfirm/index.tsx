import { NPopconfirm } from 'naive-ui'
import { defineComponent } from 'vue'

const UPopconfirm = defineComponent({
  name: 'UPopconfirm',
  extends: NPopconfirm,
  setup(props, ctx) {
    return () => <NPopconfirm {...props}>{ctx.slots.default?.()}</NPopconfirm>
  }
})

export default UPopconfirm
