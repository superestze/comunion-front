import { NSelect } from 'naive-ui'
import type { SelectProps } from 'naive-ui'
import { defineComponent } from 'vue'
import { ArrowDownOutlined } from '@comunion/icons'
import './DropdownFilter.css'

export type UDropdownProps = SelectProps

const UDropdownFilter = defineComponent({
  name: 'UDropdownFilter',
  extends: NSelect,
  setup(props) {
    return () => (
      <NSelect {...props} class="u-dropdown-filter" placeholder={props.placeholder || 'Select'}>
        {{
          arrow: () => <ArrowDownOutlined class="u-dropdown-filter__arrow" />
        }}
      </NSelect>
    )
  }
})

export default UDropdownFilter
