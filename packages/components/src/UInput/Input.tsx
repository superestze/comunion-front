import type { InputProps } from 'naive-ui'
import { NInput } from 'naive-ui'
import { defineComponent } from 'vue'
import './styles/input.css'
export type UInputProps = InputProps

export default defineComponent<UInputProps>({
  name: 'UInput',
  setup(props) {
    return () => {
      return <NInput {...props} />
    }
  }
})
