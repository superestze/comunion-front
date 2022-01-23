import { NButton } from 'naive-ui'
import type { ButtonProps } from 'naive-ui'
import type { SetupContext } from 'vue'
import './index.css'

export type UButtonProps = ButtonProps

const UButton = (props: UButtonProps, { slots }: SetupContext) => {
  return (
    <NButton class="u-button" {...props}>
      {slots.default?.()}
    </NButton>
  )
}

export default UButton
