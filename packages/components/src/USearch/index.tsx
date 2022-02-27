import { NInput } from 'naive-ui'
import type { InputProps } from 'naive-ui'
import { defineComponent } from 'vue'
import { SearchOutlined } from '@comunion/icons'
import './index.css'

export type USearchProps = InputProps & { className?: string }

const USearch = defineComponent<USearchProps>({
  name: 'USearch',
  setup(props) {
    const { className = '' } = props

    return () => (
      <NInput
        {...props}
        class={`u-search ${className}`}
        placeholder={props.placeholder || 'search'}
      >
        {{
          prefix: () => <SearchOutlined class="u-search-prefix" />
        }}
      </NInput>
    )
  }
})

export default USearch
