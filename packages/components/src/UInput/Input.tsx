import type { InputProps } from 'naive-ui'
import { NInput } from 'naive-ui'
import { defineComponent, PropType } from 'vue'

export type UInputPropsType = InputProps

export default defineComponent({
  name: 'UInput',
  extends: NInput,
  props: {
    size: {
      type: String as PropType<InputProps['size']>,
      default: 'large'
    }
  },
  setup(props, ctx) {
    return () => {
      return <NInput {...props} v-slots={ctx.slots} />
    }
  }
})
