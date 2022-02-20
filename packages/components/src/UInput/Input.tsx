import { defineComponent } from 'vue'
import type { InputProps } from 'naive-ui'
import { NInput } from 'naive-ui'
import './styles/input.css'

export type UInputProps = InputProps

export default defineComponent({
  name: 'UInput',
  extends: NInput,
  setup(props) {
    return () => {
      return <NInput {...props} />
    }
  }
})
