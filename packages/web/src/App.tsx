import {
  UStyleProvider,
  UHashInputProvider,
  UMessage,
  UMessageProvider
} from '@comunion/components'
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import { GlobalConfigProvider, UserProfileProvider, WalletProvider } from './providers'
import { services } from './services'

export default defineComponent({
  name: 'App',
  setup() {
    const onSearchHash = async (value: string, category: string) => {
      const { error, data } = await services['meta@tag-list']({
        isIndex: true,
        limit: 10,
        offset: 0,
        keyword: value,
        category
      })
      return error ? [] : data.list.map(item => ({ label: item.name, value: item.id }))
    }

    return () => (
      <UStyleProvider>
        <UMessageProvider>
          <UMessage />
        </UMessageProvider>
        <GlobalConfigProvider>
          <UHashInputProvider onSearch={onSearchHash}>
            <UserProfileProvider>
              <WalletProvider>
                <RouterView />
              </WalletProvider>
            </UserProfileProvider>
          </UHashInputProvider>
        </GlobalConfigProvider>
      </UStyleProvider>
    )
  }
})
