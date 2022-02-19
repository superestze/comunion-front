import type { InputGroupLabelProps } from 'naive-ui'
import { NInputGroupLabel } from 'naive-ui'
import type { SetupContext } from 'vue'
import './styles/input-group-label.css'

export type UInputGroupLabelProps = InputGroupLabelProps

const UInputGroupLabel = (props: UInputGroupLabelProps, { slots }: SetupContext) => {
  return <NInputGroupLabel {...props}>{slots.default?.()}</NInputGroupLabel>
}

export default UInputGroupLabel
