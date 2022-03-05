import type { SelectProps } from 'naive-ui'
import { NSelect } from 'naive-ui'
import { DefineComponent, defineComponent } from 'vue'

export type USelectPropsType = SelectProps

const USelect: DefineComponent<USelectPropsType> = defineComponent({
  name: 'USelect',
  extends: NSelect,
  setup(props, ctx) {
    return () => <NSelect {...props} v-slots={ctx.slots} />
  }
})

export default USelect
