import { NFormItem } from 'naive-ui'
import { defineComponent } from 'vue'

const UFormItem = defineComponent({
  name: 'UFormItem',
  extends: NFormItem,
  setup(props, ctx) {
    return () => <NFormItem {...ctx.attrs} v-slots={ctx.slots} />
  }
})

export default UFormItem
