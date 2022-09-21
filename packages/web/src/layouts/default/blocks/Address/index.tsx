import { UButton } from '@comunion/components'
import { DisConnectFilled } from '@comunion/icons'
import { shortenAddress } from '@comunion/utils'
import { defineComponent } from 'vue'
import HeaderDropdown from '../../components/HeaderDropdown'
import { useUserStore, useWalletStore } from '@/stores'

const WalletAddress = defineComponent({
  name: 'HeaderAddress',
  setup(props, ctx) {
    const walletStore = useWalletStore()
    const userStore = useUserStore()

    const connectWallet = async () => {
      if (walletStore.connected && walletStore.address) {
        return
      }
      walletStore.openBindModal().then(data => {
        if (data?.token) {
          userStore.refreshToken(data.token)
          userStore.refreshMe()
        }
      })
    }

    function disconnect() {
      walletStore.disconnectWallet()
    }

    return () => {
      // userStore.
      const btn = (
        <UButton size="small" onClick={connectWallet} class="font-primary h-8 !font-normal">
          {walletStore.connected && walletStore.address
            ? shortenAddress(walletStore.address)
            : 'Connect Wallet'}
        </UButton>
      )

      return (
        <>
          {walletStore.connected ? (
            <HeaderDropdown
              placement="bottom-end"
              options={[
                {
                  key: 'disconnect',
                  icon: () => <DisConnectFilled class="bg-purple rounded-3xl text-primary" />,
                  label: () => (
                    <div class="flex items-center" onClick={disconnect}>
                      Disconnect
                    </div>
                  )
                }
              ]}
            >
              {btn}
            </HeaderDropdown>
          ) : (
            btn
          )}
        </>
      )
    }
  }
})

export default WalletAddress
