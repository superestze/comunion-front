import type { DropdownProps } from 'naive-ui'
import { NDropdown } from 'naive-ui'
import { DefineComponent, defineComponent } from 'vue'

export type UDropdownPropsType = DropdownProps

const UDropdown: DefineComponent<UDropdownPropsType> = defineComponent({
  name: 'UDropdown',
  extends: NDropdown,
  setup(props, ctx) {
    return () => <NDropdown {...props} v-slots={ctx.slots} />
  }
})

export default UDropdown
