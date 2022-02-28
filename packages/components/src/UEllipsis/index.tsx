import { NEllipsis } from 'naive-ui'
import { defineComponent } from 'vue'

const UEllipsis = defineComponent({
  name: 'UEllipsis',
  extends: NEllipsis,
  setup(props, ctx) {
    return () => <NEllipsis {...props}>{ctx.slots.default?.()}</NEllipsis>
  }
})

export default UEllipsis
