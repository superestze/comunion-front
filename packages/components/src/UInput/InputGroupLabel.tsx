import { NInputGroupLabel } from 'naive-ui'
import { defineComponent } from 'vue'

const UInputGroupLabel = defineComponent({
  name: 'UInputGroupLabel',
  extends: NInputGroupLabel,
  setup(props, ctx) {
    return () => <NInputGroupLabel {...props} v-slots={ctx.slots} />
  }
})

export default UInputGroupLabel
