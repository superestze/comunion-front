import { SignOutFilled } from '@comunion/icons'
import { shortenAddress } from '@comunion/utils'
import { defineComponent } from 'vue'
import HeaderButton from '../../components/HeaderButton'
import HeaderDropdown from '../../components/HeaderDropdown'
import { useWalletStore } from '@/stores'
// import { UserResponse } from '@/types'

const WalletAddress = defineComponent({
  name: 'HeaderAddress',
  setup(props, ctx) {
    const walletStore = useWalletStore()

    const connectWallet = async () => {
      if (walletStore.connected && walletStore.address) {
        return
      }
      walletStore.openBindModal()
    }

    function disconnect() {
      walletStore.disconnectWallet()
    }

    return () => {
      // userStore.
      const btn = (
        <HeaderButton class={ctx.attrs.class} onClick={connectWallet}>
          {walletStore.connected && walletStore.address
            ? shortenAddress(walletStore.address)
            : 'Connect Wallet'}
        </HeaderButton>
      )

      return (
        <div class="h-10 leading-normal">
          {walletStore.connected ? (
            <HeaderDropdown
              placement="bottom-end"
              options={[
                {
                  key: 'disconnect',
                  icon: () => <SignOutFilled class="bg-purple rounded-3xl text-primary" />,
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
        </div>
      )
    }
  }
})

export default WalletAddress
