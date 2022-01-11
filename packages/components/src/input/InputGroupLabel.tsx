import { NInputGroupLabel } from 'naive-ui'
import { defineComponent } from 'vue'
import type { CInputGroupLabelProps } from './interface'
import './styles/input-group-label.css'

export default defineComponent<CInputGroupLabelProps>({
  name: 'InputLabel',
  setup(props, { slots }) {
    return () => {
      return <NInputGroupLabel {...props}>{slots.default()}</NInputGroupLabel>
    }
  }
})
