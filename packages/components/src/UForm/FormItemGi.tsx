import type { FormItemGiProps } from 'naive-ui'
import { NFormItemGi } from 'naive-ui'
import { defineComponent } from 'vue'

const UFormItemGi = defineComponent<FormItemGiProps>({
  name: 'UFormItemGi',
  setup(props, ctx) {
    return () => <NFormItemGi {...ctx.attrs}>{ctx.slots}</NFormItemGi>
  }
})

export default UFormItemGi
