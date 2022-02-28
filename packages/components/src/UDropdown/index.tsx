import { NSelect } from 'naive-ui'
import type { SelectProps } from 'naive-ui'
import { defineComponent } from 'vue'
import { ArrowDownOutlined } from '@comunion/icons'
import './index.css'

export type UDropdownProps = SelectProps

const UDropdown = defineComponent<UDropdownProps>({
  name: 'UDropdown',
  setup(props) {
    return () => (
      <NSelect {...props} class="u-dropdown" placeholder={props.placeholder || 'Select'}>
        {{
          arrow: () => <ArrowDownOutlined class="u-dropdown-arrow" />
        }}
      </NSelect>
    )
  }
})

export default UDropdown
