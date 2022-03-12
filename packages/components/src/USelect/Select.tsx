import type { SelectProps } from 'naive-ui'
import { NSelect } from 'naive-ui'
import { defineComponent, PropType } from 'vue'

export type USelectPropsType = SelectProps

const USelect = defineComponent({
  name: 'USelect',
  extends: NSelect,
  props: {
    size: {
      type: String as PropType<SelectProps['size']>,
      default: 'large'
    }
  },
  setup(props, ctx) {
    return () => <NSelect {...props} v-slots={ctx.slots} />
  }
})

export default USelect
