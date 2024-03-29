import { computed, InputHTMLAttributes, ref } from 'vue'
import { SelectOption } from '../constants'

export type TagLimitedProps = {
  value?: (string | number)[]
  tagLimit: number
  charLimit: number
}

export default function useLimitTags(props: TagLimitedProps, defaultOptions: SelectOption[]) {
  const searchText = ref('')

  function countChars(text: string) {
    let count = 0
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i)
      if (code > 127 || code === 94) {
        count += 2
      } else {
        count += 1
      }
    }
    return count
  }

  const options = computed<SelectOption[]>(() => {
    if (!props.value) {
      return defaultOptions
    }
    if (props.value.length >= props.tagLimit) {
      return defaultOptions.map<SelectOption>(tag => ({
        ...tag,
        disabled: !props.value?.includes(tag.value)
      }))
    }
    return defaultOptions
  })

  const inputProps = computed<InputHTMLAttributes>(() => {
    const charCount = countChars(searchText.value)
    return {
      maxlength:
        charCount >= props.charLimit ? 0 : props.charLimit - charCount + searchText.value.length,
      readonly: props.value ? props.value.length >= props.tagLimit : false
    }
  })

  const onSearch = (query: string) => {
    searchText.value = query
  }

  return {
    options,
    inputProps,
    onSearch
  }
}
