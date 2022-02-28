import { NSelect } from 'naive-ui'
import type { SelectProps } from 'naive-ui'
import { defineComponent } from 'vue'

export type USelectProps = SelectProps

const USelect = defineComponent<USelectProps>({
  name: 'USelect',
  setup(props) {
    return () => (
      <NSelect {...props} class="u-select" placeholder={props.placeholder || 'Select'}></NSelect>
    )
  }
})

export default USelect
