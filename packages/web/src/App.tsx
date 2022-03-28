import {
  UStyleProvider,
  UHashInputProvider,
  UMessage,
  UMessageProvider,
  UUploadProvider
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

    const onUpload = async (file: File, cb: (percent: number) => void) => {
      const form = new FormData()
      form.append('file', file)
      const { error, data } = await services['misc@文件-上传'](form)
      return error ? '' : data.url
    }

    return () => (
      <UStyleProvider>
        <UMessageProvider>
          <UMessage />
        </UMessageProvider>
        <GlobalConfigProvider>
          <UUploadProvider onUpload={onUpload}>
            <UHashInputProvider onSearch={onSearchHash}>
              <UserProfileProvider>
                <WalletProvider>
                  <RouterView />
                </WalletProvider>
              </UserProfileProvider>
            </UHashInputProvider>
          </UUploadProvider>
        </GlobalConfigProvider>
      </UStyleProvider>
    )
  }
})
