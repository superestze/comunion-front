import { NInputGroupLabel } from 'naive-ui'
import { defineComponent } from 'vue'

const UInputGroupLabel = defineComponent({
  name: 'UInputGroupLabel',
  extends: NInputGroupLabel,
  setup(props, ctx) {
    return () => <NInputGroupLabel {...props}>{ctx.slots.default?.()}</NInputGroupLabel>
  }
})

export default UInputGroupLabel
