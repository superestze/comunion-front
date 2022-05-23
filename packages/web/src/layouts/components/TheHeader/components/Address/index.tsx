import { message, UDropdown } from '@comunion/components'
import { shortenAddress } from '@comunion/utils'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import HeaderButton from '../Button'
import styles from './index.module.css'
import { useUserStore, useWalletStore } from '@/stores'

const WalletAddress = defineComponent({
  name: 'HeaderAddress',
  setup(props, ctx) {
    const userStore = useUserStore()
    const walletStore = useWalletStore()
    const router = useRouter()

    const connectWallet = () => {
      walletStore.ensureWalletConnected()
    }

    function logout() {
      userStore.onLogout()
      message.info('You have been logged out')
      router.replace('/auth/login')
      // setTimeout(() => {
      //   window.location.reload()
      // }, 1500)
    }

    return () => {
      const btn = (
        <HeaderButton class={ctx.attrs.class} onClick={connectWallet}>
          {walletStore.connected && walletStore.address
            ? shortenAddress(walletStore.address)
            : 'Connect Wallet'}
        </HeaderButton>
      )

      return walletStore.connected ? (
        <UDropdown
          trigger="click"
          width={200}
          class={styles.dropdown}
          placement="bottom-start"
          themeOverrides={{
            optionHeightMedium: 'auto'
          }}
          options={[
            {
              type: 'group',
              label: 'Connected',
              key: 'label',
              children: [
                {
                  key: 'logout',
                  label: () => <div onClick={logout}>Logout</div>
                }
              ]
            }
          ]}
        >
          {btn}
        </UDropdown>
      ) : (
        btn
      )
    }
  }
})

export default WalletAddress
