import { NSelect } from 'naive-ui'
import { computed, defineComponent, PropType } from 'vue'
import { DEFAULT_SKILLS } from '../constants'
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
      default: 'Choose your skill tag'
    },
    maxLength: {
      type: Number,
      default: 3
    }
  },
  setup(props, ctx) {
    const options = computed<SelectOption[]>(() => {
      if (!props.value) {
        return DEFAULT_SKILLS
      }
      if (props.value.length >= props.maxLength) {
        return DEFAULT_SKILLS.map<SelectOption>(tag => ({
          ...tag,
          disabled: !props.value!.includes(tag.value)
        }))
      }
      return DEFAULT_SKILLS
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
