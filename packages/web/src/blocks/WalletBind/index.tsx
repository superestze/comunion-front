import { UWalletConnect, UWalletConnectPropsType } from '@comunion/components'
import { storage } from '@comunion/utils'
import { defineComponent } from 'vue'
import { useWalletStore, useUserStore } from '@/stores'
import { UserResponse } from '@/types'
import { getWallet } from '@/wallets'
import AbstractWallet from '@/wallets/AbstractWallet'
export default defineComponent({
  name: 'WalletBindBlock',
  setup() {
    const walletStore = useWalletStore()
    const userStore = useUserStore()

    const onWalletClick: UWalletConnectPropsType['onClick'] = async type => {
      const profile = (userStore.profile || storage('session').get('oauth:info')) as UserResponse
      if (profile.address) {
        await walletStore.onSelectWallet(type)
        walletStore.closeBindModal()
        return
      }
      const wallet = await getWallet(type)
      walletStore.bindWallet(wallet as AbstractWallet)
    }

    const onWalletCancel = () => {
      walletStore.closeBindModal()
    }

    return () => (
      <UWalletConnect
        show={walletStore.bindModalOpened}
        onClick={onWalletClick}
        onClose={onWalletCancel}
      />
    )
  }
})
