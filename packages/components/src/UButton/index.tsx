import { NButton } from 'naive-ui'
import type { ButtonProps } from 'naive-ui'
import type { SetupContext } from 'vue'
import './index.css'

export type UButtonProps = ButtonProps & { className?: string }

const UButton = (props: UButtonProps, { slots }: SetupContext) => {
  const { className = '', ...rest } = props
  return (
    <NButton class={`u-button ${className}`} {...rest}>
      {slots.default?.()}
    </NButton>
  )
}

export default UButton
