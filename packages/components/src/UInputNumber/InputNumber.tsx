import type { InputNumberProps } from 'naive-ui'
import { NInputNumber } from 'naive-ui'
import { defineComponent, PropType } from 'vue'

export type UInputNumberPropsType = InputNumberProps

const UInputNumber = defineComponent({
  name: 'UInputNumber',
  extends: NInputNumber,
  props: {
    size: {
      type: String as PropType<InputNumberProps['size']>,
      default: 'large'
    }
  },
  setup(props, ctx) {
    return () => <NInputNumber {...props} v-slots={ctx.slots}></NInputNumber>
  }
})

export default UInputNumber
