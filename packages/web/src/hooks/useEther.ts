import type { ExternalProvider, JsonRpcFetchFunc, Web3Provider } from '@ethersproject/providers'
import { providers } from 'ethers'
import type { Ref } from 'vue'
import { inject, provide, readonly, ref } from 'vue'

export interface EtherState {
  currentProvider: Ref<Web3Provider | null>
  address: Ref<string>
  loading: Ref<boolean>
}

export const etherSymbol = Symbol()

export function useEtherProvider() {
  const provider = ref<Web3Provider>()
  const address = ref('')
  const loading = ref(false)
  provide<EtherState>(etherSymbol, {
    currentProvider: provider,
    address: address,
    loading: loading
  })
}

export function useEther() {
  const ctx = inject<EtherState>(etherSymbol)
  if (!ctx) {
    throw new Error('useEther must be used after useEtherProvider')
  }
  const ret = {
    currentProvider: readonly(ctx.currentProvider),
    address: readonly(ctx.address),
    loading: readonly(ctx.loading),
    async setProvider(provider: ExternalProvider | JsonRpcFetchFunc) {
      const web3Provider = new providers.Web3Provider(provider)
      ctx.currentProvider.value = web3Provider
    },
    async onConnect(func: () => Promise<boolean>) {
      ctx.loading.value = true
      const connected = await func()
      console.log('connected', connected)
      ctx.address.value = await ctx.currentProvider.value.getSigner().getAddress()
      ctx.loading.value = false
      return connected
    },
    getSigner() {
      return ctx.currentProvider.value?.getSigner()
    }
  }
  return ret
}
