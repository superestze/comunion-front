import { NButton } from 'naive-ui'
import type { ButtonProps } from 'naive-ui'
import { defineComponent } from 'vue'
import './index.css'

export type UButtonProps = ButtonProps

export default defineComponent<UButtonProps>({
  name: 'UButton',
  setup(props, { slots }) {
    return () => (
      <NButton class="u-button" {...props}>
        {slots.default?.()}
      </NButton>
    )
  }
})
