import { NSelect } from 'naive-ui'
import type { SelectProps } from 'naive-ui'
import { defineComponent } from 'vue'

export type USelectProps = SelectProps & { className?: string; placeholder?: string }

const USelect = defineComponent<USelectProps>({
  name: 'USelect',
  setup(props) {
    const { className = '', placeholder = '' } = props

    return () => (
      <NSelect
        {...props}
        class={`u-select ${className}`}
        placeholder={placeholder || 'Select'}
      ></NSelect>
    )
  }
})

export default USelect
