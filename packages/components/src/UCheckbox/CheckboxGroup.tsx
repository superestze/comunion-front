import type { CheckboxGroupProps } from 'naive-ui'
import { NCheckboxGroup } from 'naive-ui'
import { defineComponent, PropType } from 'vue'

export type UCheckboxGroupPropsType = CheckboxGroupProps

const UCheckboxGroup = defineComponent({
  name: 'UCheckboxGroup',
  extends: NCheckboxGroup,
  props: {
    size: {
      type: String as PropType<CheckboxGroupProps['size']>,
      default: 'large'
    }
  },
  setup(props, ctx) {
    return () => <NCheckboxGroup {...props} v-slots={ctx.slots} />
  }
})

export default UCheckboxGroup
