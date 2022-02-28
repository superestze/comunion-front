import { NTabs } from 'naive-ui'
import { defineComponent } from 'vue'

const UTabs = defineComponent({
  name: 'UTabs',
  extends: NTabs,
  setup(props, ctx) {
    return () => <NTabs {...props}>{ctx.slots.default?.()}</NTabs>
  }
})

export default UTabs
