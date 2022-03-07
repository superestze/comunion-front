export type { FormInst, FormItemRule } from 'naive-ui'
import { NForm } from 'naive-ui'
import { defineComponent } from 'vue'

const UForm = defineComponent({
  name: 'UForm',
  extends: NForm,
  setup(props, ctx) {
    return () => <NForm {...ctx.attrs} v-slots={ctx.slots} />
  }
})

export default UForm
