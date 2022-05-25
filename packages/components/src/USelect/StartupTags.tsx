import { NSelect } from 'naive-ui'
import { defineComponent, PropType } from 'vue'
import { DEFAULT_STARTUP_TAGS } from '../constants'
import useLimitTags from './tag.select'

const StartupTags = defineComponent({
  name: 'StartupTags',
  inheritAttrs: true,
  extends: NSelect,
  props: {
    value: {
      type: Array as PropType<string[]>
    },
    placeholder: {
      type: String,
      default: 'Choose your startup tag'
    },
    tagLimit: {
      type: Number,
      default: 3
    },
    charLimit: {
      type: Number,
      default: 16
    }
  },
  setup(props) {
    const { options, inputProps, onSearch } = useLimitTags(props, DEFAULT_STARTUP_TAGS)
    return () => (
      <NSelect
        {...props}
        consistentMenuWidth={false}
        clearable
        maxTagCount="responsive"
        multiple
        options={options.value}
        tag
        filterable
        onSearch={onSearch}
        inputProps={inputProps.value}
      />
    )
  }
})

export default StartupTags
