import type { CheckboxProps } from 'naive-ui'
import { NCheckbox } from 'naive-ui'
import { defineComponent, PropType } from 'vue'

export type UCheckboxPropsType = CheckboxProps

const UCheckbox = defineComponent({
  name: 'UCheckbox',
  extends: NCheckbox,
  props: {
    size: {
      type: String as PropType<CheckboxProps['size']>,
      default: 'large'
    }
  },
  setup(props, ctx) {
    return () => <NCheckbox {...props} v-slots={ctx.slots} />
  }
})

export default UCheckbox
