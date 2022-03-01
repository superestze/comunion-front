import type { FormProps } from 'naive-ui'
import { NForm } from 'naive-ui'
import { defineComponent } from 'vue'

const UForm = defineComponent<FormProps>({
  name: 'UForm',
  setup(props, ctx) {
    return () => <NForm {...ctx.attrs}>{ctx.slots}</NForm>
  }
})

export default UForm
