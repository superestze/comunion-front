import { NImage } from 'naive-ui'
import { defineComponent } from 'vue'

const UImage = defineComponent({
  name: 'UImage',
  extends: NImage,
  setup(props, ctx) {
    return () => <NImage {...props}>{ctx.slots.default?.()}</NImage>
  }
})

export default UImage
