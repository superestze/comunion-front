import { defineComponent } from 'vue'
import type { ModalProps } from 'naive-ui'
import { NModal } from 'naive-ui'

export type UModalPropsType = ModalProps

const UModal = defineComponent({
  name: 'UModal',
  extends: NModal,
  setup(props, ctx) {
    return () => <NModal {...props} v-slots={ctx.slots} />
  }
})

export default UModal
