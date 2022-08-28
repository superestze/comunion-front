import { NSelect } from 'naive-ui'
import { defineComponent, PropType } from 'vue'
import { DEFAULT_SKILLS } from '../constants'
import useLimitTags from './tag.select'
import './SkillTags.css'

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
    tagLimit: {
      type: Number,
      default: 8
    },
    charLimit: {
      type: Number,
      default: 16
    }
  },
  setup(props) {
    const { options, inputProps, onSearch } = useLimitTags(props, DEFAULT_SKILLS)
    return () => (
      <NSelect
        {...props}
        class="skill-tags"
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
