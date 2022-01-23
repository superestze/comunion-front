import type { InputGroupProps } from 'naive-ui'
import { NInputGroup } from 'naive-ui'
import type { SetupContext } from 'vue'
import './styles/input-group.css'

export type UInputGroupProps = InputGroupProps

const UInputLabel = (props: UInputGroupProps, { slots }: SetupContext) => {
  return <NInputGroup {...props}>{slots.default?.()}</NInputGroup>
}

export default UInputLabel
