import type { InputGroupProps } from 'naive-ui'
import { NInputGroup } from 'naive-ui'
import { defineComponent } from 'vue'
import './styles/input-group.css'
export type UInputGroupProps = InputGroupProps

export default defineComponent<UInputGroupProps>({
  name: 'UInputLabel',
  setup(props, { slots }) {
    return () => {
      return <NInputGroup {...props}>{slots.default?.()}</NInputGroup>
    }
  }
})
