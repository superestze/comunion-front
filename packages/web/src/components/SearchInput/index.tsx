import { NInput, InputProps } from 'naive-ui'
import { defineComponent, ref, computed, watch } from 'vue'
import './index.css'

export default defineComponent<InputProps>({
  name: 'SearchInput',
  extends: NInput,
  inheritAttrs: true,
  setup(props) {
    const inputRef = ref(null)
    const input = ref<string>('')
    const showInput = ref<boolean>(false)
    const showLong = computed<boolean>(() => {
      return input.value.trim().length > 0 || showInput.value
    })

    const handleChange = (str: string) => {
      input.value = str
      console.warn(input)
    }

    const handleBlur = () => {
      setTimeout(() => {
        if (props.loading) {
          watch(
            () => props.loading,
            () => {
              if (!props.loading) {
                showInput.value = false
              }
            }
          )
        } else {
          showInput.value = false
        }
      }, 100)
    }

    return {
      inputRef,
      input,
      showInput,
      showLong,
      handleChange,
      handleBlur,
      props
    }
  },
  render() {
    return (
      <div
        class={` w-20  u-search-input relative overflow-hidden h-10 ${
          this.showLong ? '!w-40' : ''
        } ${this.input.trim().length > 0 ? 'text-color1' : 'text-color2'}`}
        onClick={() => {
          if (this.props.loading) {
            return null
          }
          this.showInput = true
          setTimeout(() => {
            this.inputRef.focus()
          }, 300)
        }}
      >
        <div class={`bg-purple w-full h-full rounded-sm px-3 flex items-center`}>
          <span class="truncate">{this.input || 'Search'}</span>
        </div>
        <NInput
          ref="inputRef"
          {...this.props}
          class={`absolute top-0 left-0 border-0 ${this.showInput ? '' : '!-top-99'}`}
          placeholder={this.placeholder || 'Search'}
          onInput={this.handleChange}
          onFocus={() => (this.showInput = true)}
          onBlur={this.handleBlur}
        ></NInput>
      </div>
    )
  }
})
