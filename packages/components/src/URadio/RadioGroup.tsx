import { NRadioGroup } from 'naive-ui'
import { defineComponent } from 'vue'

const URadioGroup = defineComponent({
  name: 'URadioGroup',
  extends: NRadioGroup,
  setup(props, ctx) {
    return () => <NRadioGroup {...props} v-slots={ctx.slots} />
  }
})

export default URadioGroup
