import type { FormItemProps } from 'naive-ui'
import { NFormItem } from 'naive-ui'
import { defineComponent } from 'vue'

const UFormItem = defineComponent<FormItemProps>({
  name: 'UFormItem',
  setup(props, ctx) {
    return () => <NFormItem {...ctx.attrs}>{ctx.slots}</NFormItem>
  }
})

export default UFormItem
