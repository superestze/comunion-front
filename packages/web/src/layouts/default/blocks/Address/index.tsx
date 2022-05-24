import { SignOutFilled } from '@comunion/icons'
import { shortenAddress } from '@comunion/utils'
import { defineComponent } from 'vue'
import HeaderButton from '../../components/HeaderButton'
import HeaderDropdown from '../../components/HeaderDropdown'
import { useWalletStore } from '@/stores'

const WalletAddress = defineComponent({
  name: 'HeaderAddress',
  setup(props, ctx) {
    const walletStore = useWalletStore()

    const connectWallet = () => {
      walletStore.ensureWalletConnected()
    }

    function disconnect() {
      walletStore.disconnectWallet()
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
      )
    }
  }
})

export default WalletAddress
