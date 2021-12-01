import { NInput } from 'naive-ui'
import { defineComponent } from 'vue'
import type { CInputProps } from './interface'
import './styles/input.css'

export default defineComponent<CInputProps>({
  name: 'Input',
  setup(props) {
    return () => {
      return <NInput {...props} />
    }
  }
})
