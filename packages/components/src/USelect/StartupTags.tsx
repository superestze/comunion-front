import { NSelect } from 'naive-ui'
import { defineComponent, PropType, computed } from 'vue'
import { DEFAULT_STARTUP_TAGS } from '../constants'
import type { SelectOption } from '../constants'

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
    maxLength: {
      type: Number,
      default: 8
    }
  },
  setup(props, ctx) {
    const options = computed<SelectOption[]>(() => {
      if (!props.value) {
        return DEFAULT_STARTUP_TAGS
      }
      if (props.value.length >= props.maxLength) {
        return DEFAULT_STARTUP_TAGS.map<SelectOption>(tag => ({
          ...tag,
          disabled: !props.value!.includes(tag.value)
        }))
      }
      return DEFAULT_STARTUP_TAGS
    })
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
        inputProps={{
          maxlength: 16
        }}
      />
    )
  }
})

export default StartupTags
