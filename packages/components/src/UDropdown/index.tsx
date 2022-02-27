import { NSelect } from 'naive-ui'
import type { SelectProps } from 'naive-ui'
import { defineComponent } from 'vue'
import { ArrowDownOutlined } from '@comunion/icons'
import './index.css'

export type UDropdownProps = SelectProps & { className?: string; placeholder?: string }

const UDropdown = defineComponent<UDropdownProps>({
  name: 'UDropdown',
  setup(props) {
    const { className = '', placeholder = '' } = props

    return () => (
      <NSelect {...props} class={`u-dropdown ${className}`} placeholder={placeholder || 'Select'}>
        {{
          arrow: () => <ArrowDownOutlined class="u-dropdown-arrow" />
        }}
      </NSelect>
    )
  }
})

export default UDropdown
