import { NSwitch } from 'naive-ui'
import { defineComponent } from 'vue'

const USwitch = defineComponent({
  name: 'USwitch',
  extends: NSwitch,
  setup(props, ctx) {
    return () => <NSwitch {...props}>{ctx.slots.default?.()}</NSwitch>
  }
})

export default USwitch
