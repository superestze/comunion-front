import { NTime } from 'naive-ui'
import { defineComponent } from 'vue'

const UTime = defineComponent({
  name: 'UTime',
  extends: NTime,
  setup(props, ctx) {
    return () => <NTime {...props}>{ctx.slots.default?.()}</NTime>
  }
})

export default UTime
