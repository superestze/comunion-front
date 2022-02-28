import { NUpload } from 'naive-ui'
import { defineComponent } from 'vue'

const UUpload = defineComponent({
  name: 'UUpload',
  extends: NUpload,
  setup(props, ctx) {
    return () => <NUpload {...props}>{ctx.slots.default?.()}</NUpload>
  }
})

export default UUpload
