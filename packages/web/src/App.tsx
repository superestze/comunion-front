import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import { GlobalConfigProvider, UserProfileProvider, WalletProvider } from './providers'

export default defineComponent({
  name: 'App',
  setup() {
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
