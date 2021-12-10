import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import { GlobalConfigProvider, UserProfileProvider, WalletProvider } from './providers'
// import { useEtherProvider } from './hooks/useEther'

export default defineComponent({
  name: 'App',
  setup() {
    // useEtherProvider()
    return () => (
      <GlobalConfigProvider>
        <UserProfileProvider>
          <WalletProvider>
            <RouterView />
          </WalletProvider>
        </UserProfileProvider>
      </GlobalConfigProvider>
    )
  }
})
