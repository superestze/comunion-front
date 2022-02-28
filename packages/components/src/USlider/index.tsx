import { NSlider } from 'naive-ui'
import { defineComponent } from 'vue'

const USlider = defineComponent({
  name: 'USlider',
  extends: NSlider,
  setup(props, ctx) {
    return () => <NSlider {...props}>{ctx.slots.default?.()}</NSlider>
  }
})

export default USlider
