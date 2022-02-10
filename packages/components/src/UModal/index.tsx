import { defineComponent } from 'vue'
import type { ModalProps } from 'naive-ui'
import { NModal } from 'naive-ui'

type UModalProps = ModalProps

const UModal = defineComponent<UModalProps>({
  name: 'UModal',
  setup(props, ctx) {
    return () => <NModal {...ctx.attrs}>{() => ctx.slots.default?.()}</NModal>
  }
})

export default UModal
