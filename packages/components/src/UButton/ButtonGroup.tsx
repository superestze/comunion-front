import { NButtonGroup } from 'naive-ui'
import { defineComponent } from 'vue'

const UButtonGroup = defineComponent({
  name: 'UButtonGroup',
  extends: NButtonGroup,
  setup(props, ctx) {
    return () => <NButtonGroup {...props} v-slots={ctx.slots} />
  }
})

export default UButtonGroup
