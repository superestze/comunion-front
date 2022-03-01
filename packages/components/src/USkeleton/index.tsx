import { NSkeleton } from 'naive-ui'
import { defineComponent } from 'vue'

const USkeleton = defineComponent({
  name: 'USkeleton',
  extends: NSkeleton,
  inheritAttrs: true,
  setup(props, ctx) {
    return () => <NSkeleton {...props} v-slots={ctx.slots} />
  }
})

export default USkeleton
