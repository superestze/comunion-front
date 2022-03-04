import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'

import {
  UStyleProvider,
  UHashInputProvider,
  UMessageProvider,
  UMessage,
  ULoadingBar,
  ULoadingBarProvider
} from '@/comps/index'

interface IProps {}

const onHashSearch = (value: string) => {
  return new Promise<{ label: string; value: string }[]>(resolve => {
    resolve(
      Array.from({ length: value.length }).map((_, i) => ({
        label: `#${value}_${i}#`,
        value: `${value}_${i}`
      }))
    )
  })
}

export default defineComponent<IProps>({
  setup() {
    return () => {
      return (
        <UStyleProvider>
          <UMessageProvider>
            <UMessage />
          </UMessageProvider>
          <ULoadingBarProvider>
            <ULoadingBar />
          </ULoadingBarProvider>
          <UHashInputProvider onSearch={onHashSearch}>
            <RouterView></RouterView>
          </UHashInputProvider>
        </UStyleProvider>
      )
    }
  }
})
