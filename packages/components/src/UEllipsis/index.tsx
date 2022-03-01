import { NEllipsis } from 'naive-ui'
import { defineComponent } from 'vue'

const UEllipsis = defineComponent({
  name: 'UEllipsis',
  extends: NEllipsis,
  inheritAttrs: true,
  setup(props, ctx) {
    return () => <NEllipsis {...props} v-slots={ctx.slots} />
  }
})

export default UEllipsis
