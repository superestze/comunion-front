import { NScrollbar } from 'naive-ui'
import { defineComponent } from 'vue'

const UScrollbar = defineComponent({
  name: 'UScrollbar',
  extends: NScrollbar,
  setup(props, ctx) {
    return () => <NScrollbar {...props} v-slots={ctx.slots} />
  }
})

export default UScrollbar
