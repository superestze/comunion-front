import { UDrawer } from '@comunion/components'
import { defineComponent, ref } from 'vue'
import CreateStartupForm from './CreateForm'
import { useWalletStore } from '@/stores'

export type CreateStartupRef = {
  show: () => void
  close: () => void
}

const CreateStartupBlock = defineComponent({
  name: 'CreateStartupBlock',
  setup() {
    const visible = ref(false)
    const walletStore = useWalletStore()

    const show = async () => {
      await walletStore.ensureWalletConnected()
      // if (!walletStore.isNetworkSupported) {
      //   message.warning('Please switch to the supported network to create a startup')
      //   // not supported network, try to switch
      //   walletStore.openNetworkSwitcher()
      // } else {
      //   visible.value = true
      // }
      visible.value = true
    }

    const close = () => {
      visible.value = false
    }

    return { show, close, visible }
  },
  render() {
    return (
      <UDrawer title="Create Startup" maskClosable={false} v-model:show={this.visible}>
        {this.visible && <CreateStartupForm onCancel={this.close} />}
      </UDrawer>
    )
  }
})

export default CreateStartupBlock
