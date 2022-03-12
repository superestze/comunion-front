import type { InputGroupProps } from 'naive-ui'
import { NInputGroup } from 'naive-ui'
import { defineComponent, PropType } from 'vue'

export type UInputGroupPropsType = InputGroupProps

const UInputGroup = defineComponent({
  name: 'UInputGroup',
  extends: NInputGroup,
  props: {
    size: {
      type: String as PropType<InputGroupProps['size']>,
      default: 'large'
    }
  },
  setup(props, ctx) {
    return () => {
      return <NInputGroup {...props} v-slots={ctx.slots} />
    }
  }
})

export default UInputGroup
