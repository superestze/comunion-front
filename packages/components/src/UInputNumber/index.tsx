import { NInputNumber } from 'naive-ui'
import { defineComponent } from 'vue'

const UInputNumber = defineComponent({
  name: 'UInputNumber',
  extends: NInputNumber,
  setup(props, ctx) {
    return () => <NInputNumber {...props}>{ctx.slots.default?.()}</NInputNumber>
  }
})

export default UInputNumber
