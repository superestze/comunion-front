import { NScrollbar } from 'naive-ui'
import { defineComponent } from 'vue'

const UScrollbar = defineComponent({
  name: 'UScrollbar',
  extends: NScrollbar,
  setup(props, ctx) {
    return () => <NScrollbar {...props}>{ctx.slots.default?.()}</NScrollbar>
  }
})

export default UScrollbar
