import { NTooltip } from 'naive-ui'
import { defineComponent } from 'vue'

const UTooltip = defineComponent({
  name: 'UTooltip',
  extends: NTooltip,
  setup(props, ctx) {
    return () => <NTooltip {...props}>{ctx.slots.default?.()}</NTooltip>
  }
})

export default UTooltip
