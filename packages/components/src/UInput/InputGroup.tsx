import type { InputGroupProps } from 'naive-ui'
import { NInputGroup } from 'naive-ui'
import { defineComponent } from 'vue'

export type UInputGroupProps = InputGroupProps

const UInputGroup = defineComponent({
  name: 'UInputGroup',
  extends: NInputGroup,
  setup(props, ctx) {
    return () => {
      return <NInputGroup {...props}>{ctx.slots.default?.()}</NInputGroup>
    }
  }
})

export default UInputGroup
