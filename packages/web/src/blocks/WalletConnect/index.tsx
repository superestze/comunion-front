import { UWalletConnect, UWalletConnectPropsType } from '@comunion/components'
import { defineComponent } from 'vue'
import { useUserStore, useWalletStore } from '@/stores'
const WalletConnectBlock = defineComponent({
  name: 'WalletConnectBlock',
  setup() {
    const walletStore = useWalletStore()
    const userStore = useUserStore()

    const onWalletClick: UWalletConnectPropsType['onClick'] = async type => {
      const wallet = await walletStore.onSelectWallet(type)
      if (wallet && !userStore.logged) {
        await userStore.loginWithWalletAddress(wallet)
      }
      walletStore.resolveWalletConnect(!!wallet)
    }

    const updateModalOpened = (value: boolean) => {
      walletStore.connectModalOpened = value
    }

    return () => (
      <UWalletConnect
        show={walletStore.connectModalOpened}
        onUpdateShow={updateModalOpened}
        onClick={onWalletClick}
      />
    )
  }
})

export default WalletConnectBlock
