import { NButton } from 'naive-ui'
import type { ButtonProps } from 'naive-ui'
import { defineComponent, PropType } from 'vue'

export type UButtonPropsType = ButtonProps

const UButton = defineComponent({
  extends: NButton,
  props: {
    size: {
      type: String as PropType<ButtonProps['size']>,
      default: 'large'
    }
  },
  setup(props, { slots }) {
    return () => <NButton {...props} v-slots={slots} />
  }
})

export default UButton
