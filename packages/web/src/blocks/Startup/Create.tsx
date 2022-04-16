import { UDrawer } from '@comunion/components'
import { defineComponent, ref, VNode } from 'vue'
import CreateStartupForm from './CreateForm'
import { useWalletStore } from '@/stores'

const CreateStartupBlock = defineComponent({
  name: 'CreateStartupBlock',
  setup() {
    const show = ref(false)
    const walletStore = useWalletStore()

    const onClose = () => {
      show.value = false
    }

    const onClick = async () => {
      await walletStore.ensureWalletConnected()
      show.value = true
    }

    return { onClose, onClick, show }
  },
  render() {
    const { $slots, onClick, onClose } = this
    let trigger: VNode | null = null
    // add trigger action
    if ($slots.default) {
      trigger = $slots.default()?.[0]
      if (trigger) {
        trigger.props = trigger.props || {}
        trigger.props.onClick = onClick
      }
    }

    return (
      <>
        {trigger}
        <UDrawer title="Create startup" maskClosable={false} v-model:show={this.show}>
          {this.show && <CreateStartupForm onCancel={onClose} />}
        </UDrawer>
      </>
    )
  }
})

export default CreateStartupBlock
