import { defineComponent } from 'vue'
import { NMessageProvider } from 'naive-ui'

const UMessageProvider = defineComponent({
  name: 'UMessageProvider',
  setup(props, ctx) {
    return () => <NMessageProvider>{ctx.slots.default?.()}</NMessageProvider>
  }
})

export default UMessageProvider
