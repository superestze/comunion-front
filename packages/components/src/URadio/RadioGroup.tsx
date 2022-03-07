import { NRadioGroup, RadioGroupProps } from 'naive-ui'
import { defineComponent, PropType } from 'vue'

export type URadioGroupPropsType = RadioGroupProps

const URadioGroup = defineComponent({
  name: 'URadioGroup',
  extends: NRadioGroup,
  props: {
    size: {
      type: String as PropType<RadioGroupProps['size']>,
      default: 'large'
    }
  },
  setup(props, ctx) {
    return () => <NRadioGroup {...props} v-slots={ctx.slots} />
  }
})

export default URadioGroup
