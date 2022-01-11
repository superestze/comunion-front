import { NButton } from 'naive-ui'
import { defineComponent } from 'vue'
import './index.css'
import type { UButtonProps } from './interface'

export default defineComponent<UButtonProps>({
  name: 'UButton',
  setup(props, { slots }) {
    return () => <NButton {...props}>{slots.default?.()}</NButton>
  }
})
