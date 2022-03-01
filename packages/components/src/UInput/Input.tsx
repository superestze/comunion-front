import { defineComponent } from 'vue'
import type { InputProps } from 'naive-ui'
import { NInput } from 'naive-ui'

export type UInputProps = InputProps

export default defineComponent({
  name: 'UInput',
  extends: NInput,
  setup(props, ctx) {
    return () => {
      return <NInput {...props} v-slots={ctx.slots} />
    }
  }
})
