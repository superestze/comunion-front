import {
  UStyleProvider,
  UHashInputProvider,
  UMessage,
  UMessageProvider,
  UUploadProvider
} from '@comunion/components'
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import WalletConnectBlock from './blocks/WalletConnect'
import { services } from './services'
import { upload as onUpload } from './services/a2s.adapter'
import { useUserStore, useWalletStore } from './stores'

export default defineComponent({
  name: 'App',
  setup() {
    const userStore = useUserStore()
    const walletStore = useWalletStore()

    // init user state
    userStore.init()
    // init wallet state
    walletStore.init()

    const onSearchHash = async (value: string, category: string) => {
      const { error, data } = await services['meta@tag-list']({
        isIndex: true,
        limit: 10,
        offset: 0,
        keyword: value,
        category
      })
      return error ? [] : data!.list.map(item => ({ label: item.name, value: item.id }))
    }

    return () => (
      <UStyleProvider>
        <UMessageProvider>
          <UMessage />
        </UMessageProvider>
        <UUploadProvider onUpload={onUpload}>
          <UHashInputProvider onSearch={onSearchHash}>
            {/* {userStore.inited && walletStore.inited && <RouterView />} */}
            <RouterView />
          </UHashInputProvider>
        </UUploadProvider>
        <WalletConnectBlock />
      </UStyleProvider>
    )
  }
})
