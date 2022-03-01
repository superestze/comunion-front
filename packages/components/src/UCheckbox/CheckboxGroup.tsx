import { NCheckboxGroup } from 'naive-ui'
import { defineComponent } from 'vue'

const UCheckboxGroup = defineComponent({
  name: 'UCheckboxGroup',
  extends: NCheckboxGroup,
  setup(props, ctx) {
    return () => <NCheckboxGroup {...props} v-slots={ctx.slots} />
  }
})

export default UCheckboxGroup
