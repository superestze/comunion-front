import {
  UStyleProvider,
  UHashInputProvider,
  UMessage,
  UMessageProvider,
  UContractInteraction,
  UUploadProvider,
  ULoadingBarProvider,
  ULoadingBar,
  UModalProvider
} from '@comunion/components'
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import WalletBindBlock from './blocks/WalletBind'
import WalletConnectBlock from './blocks/WalletConnect'
import { services } from './services'
import { upload as onUpload } from './services/a2s.adapter'
import { useUserStore, useWalletStore, useChainStore } from './stores'
import { useContractStore } from './stores/contract'
import { comunionTimeAgo } from './utils/timeago'
export default defineComponent({
  name: 'App',
  setup() {
    const userStore = useUserStore()
    const walletStore = useWalletStore()
    const contractStore = useContractStore()
    const chainStore = useChainStore()
    comunionTimeAgo()

    // init user state
    userStore.init()
    // init wallet state
    walletStore.init()
    // init chain state
    chainStore.init()
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
        <UContractInteraction {...contractStore.contract} />
        <ULoadingBarProvider>
          <ULoadingBar />
          <UUploadProvider onUpload={onUpload}>
            <UHashInputProvider onSearch={onSearchHash}>
              {/* {userStore.inited && walletStore.inited && <RouterView />} */}
              <UModalProvider>
                <RouterView />
              </UModalProvider>
            </UHashInputProvider>
          </UUploadProvider>
        </ULoadingBarProvider>
        <WalletConnectBlock />
        <WalletBindBlock />
      </UStyleProvider>
    )
  }
})
