import { defineComponent } from 'vue'
import { NModal } from 'naive-ui'

const UModal = defineComponent({
  name: 'UModal',
  extends: NModal,
  setup(props, ctx) {
    return () => <NModal {...props} v-slots={ctx.slots} />
  }
})

export default UModal
