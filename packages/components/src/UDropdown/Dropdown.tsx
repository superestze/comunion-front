import type { DropdownProps } from 'naive-ui'
import { NDropdown } from 'naive-ui'
import { defineComponent, PropType } from 'vue'

export type UDropdownPropsType = DropdownProps

const UDropdown = defineComponent({
  name: 'UDropdown',
  extends: NDropdown,
  props: {
    size: {
      type: String as PropType<DropdownProps['size']>,
      default: 'large'
    }
  },
  setup(props, ctx) {
    return () => <NDropdown {...props} v-slots={ctx.slots} />
  }
})

export default UDropdown
