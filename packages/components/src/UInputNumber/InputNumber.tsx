import type { InputNumberProps } from 'naive-ui'
import { NInputNumber } from 'naive-ui'
import { defineComponent } from 'vue'

export type UInputNumberPropsType = InputNumberProps

const UInputNumber = defineComponent({
  name: 'UInputNumber',
  extends: NInputNumber,
  setup(props, ctx) {
    return () => <NInputNumber {...props} v-slots={ctx.slots}></NInputNumber>
  }
})

export default UInputNumber
