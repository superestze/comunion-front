import { NButton } from 'naive-ui'
import type { ButtonProps } from 'naive-ui'
import { defineComponent } from 'vue'

export type UButtonProps = ButtonProps

const UButton = defineComponent({
  extends: NButton,
  setup(props, { slots }) {
    return () => <NButton {...props}>{slots.default?.()}</NButton>
  }
})

export default UButton
