import { NPopconfirm } from 'naive-ui'
import { defineComponent } from 'vue'

const UPopconfirm = defineComponent({
  name: 'UPopconfirm',
  extends: NPopconfirm,
  setup(props, ctx) {
    return () => <NPopconfirm {...props} v-slots={ctx.slots} />
  }
})

export default UPopconfirm
