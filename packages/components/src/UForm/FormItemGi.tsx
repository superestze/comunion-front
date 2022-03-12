import { NFormItemGi } from 'naive-ui'
import { defineComponent } from 'vue'

const UFormItemGi = defineComponent({
  name: 'UFormItemGi',
  extends: NFormItemGi,
  setup(props, ctx) {
    return () => <NFormItemGi {...ctx.attrs} v-slots={ctx.slots} />
  }
})

export default UFormItemGi
