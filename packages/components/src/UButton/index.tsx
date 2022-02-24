import { NButton } from 'naive-ui'
import type { ButtonProps } from 'naive-ui'
import { defineComponent } from 'vue'
// import './index.css'

export type UButtonProps = ButtonProps & { className?: string }

const UButton = defineComponent({
  extends: NButton,
  setup(props, ctx) {
    return () => <NButton {...props}>{ctx.slots.default?.()}</NButton>
  }
})

export default UButton
