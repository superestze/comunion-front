import type { InputGroupLabelProps } from 'naive-ui'
import { NInputGroupLabel } from 'naive-ui'
import { defineComponent } from 'vue'
import './styles/input-group-label.css'

export type UInputGroupLabelProps = InputGroupLabelProps

export default defineComponent<UInputGroupLabelProps>({
  name: 'UInputLabel',
  setup(props, { slots }) {
    return () => {
      return <NInputGroupLabel {...props}>{slots.default?.()}</NInputGroupLabel>
    }
  }
})
