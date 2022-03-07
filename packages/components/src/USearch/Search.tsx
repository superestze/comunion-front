import { SearchOutlined } from '@comunion/icons'
import { NInput } from 'naive-ui'
import type { InputProps } from 'naive-ui'
import { defineComponent, PropType } from 'vue'
import './index.css'

export type USearchPropsType = InputProps

const USearch = defineComponent({
  extends: NInput,
  props: {
    size: {
      type: String as PropType<InputProps['size']>,
      default: 'large'
    }
  },
  setup(props) {
    return () => (
      <NInput {...props} class="u-search" placeholder={props.placeholder || 'Search'}>
        {{
          prefix: () => <SearchOutlined class="u-search-prefix" />
        }}
      </NInput>
    )
  }
})

export default USearch
