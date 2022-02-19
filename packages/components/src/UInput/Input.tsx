import type { InputProps } from 'naive-ui'
import { NInput } from 'naive-ui'
import './styles/input.css'

export type UInputProps = InputProps

const UInput = (props: UInputProps) => {
  return <NInput {...props} />
}

export default UInput
