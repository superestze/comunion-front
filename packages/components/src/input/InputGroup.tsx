import { NInputGroup } from 'naive-ui'
import { defineComponent } from 'vue'
import type { CInputGroupProps } from './interface'
import './styles/input-group.css'

export default defineComponent<CInputGroupProps>({
  name: 'InputLabel',
  setup(props, { slots }) {
    return () => {
      return <NInputGroup {...props}>{slots.default()}</NInputGroup>
    }
  }
})
