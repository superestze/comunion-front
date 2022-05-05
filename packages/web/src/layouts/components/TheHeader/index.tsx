import { UButton, ULogo } from '@comunion/components'
import { shortenAddress } from '@comunion/utils'
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import CreateBlock from './components/Create'
import NetworkSwitcher from './components/Network'
import { useWalletStore } from '@/stores'

const TheHeader = defineComponent({
  name: 'TheHeader',
  setup(props, ctx) {
    const walletStore = useWalletStore()

    const connectWallet = () => {
      walletStore.ensureWalletConnected()
    }

    return () => (
      <div class="flex h-24 items-center">
        <ULogo height={32} withText theme="colorful" />
        <RouterLink
          class="ml-20 transition u-label1 hover:text-primary"
          activeClass="text-primary"
          to="/startups"
        >
          STARTUPS
        </RouterLink>
        <CreateBlock class="ml-auto" />
        <NetworkSwitcher class="ml-6" />
        <UButton class="ml-6 px-5" type="primary" ghost onClick={connectWallet}>
          {walletStore.connected && walletStore.address
            ? shortenAddress(walletStore.address)
            : 'Connect Wallet'}
        </UButton>
        <RouterLink to="/dashboard" class="text-primary ml-10 u-label1">
          MY DASHBOARD
        </RouterLink>
      </div>
    )
  }
})

export default TheHeader
