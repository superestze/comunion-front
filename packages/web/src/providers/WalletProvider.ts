import type { InjectionKey } from 'vue'
import { readonly } from 'vue'
import { inject } from 'vue'
import { provide, reactive } from 'vue'
import { defineComponent } from 'vue'

export interface WalletState {
  walletAddress?: string
  chainId?: string
}

export const WalletSymbol: InjectionKey<WalletState> = Symbol()

export const WalletProvider = defineComponent({
  name: 'WalletProvider',
  setup(props, ctx) {
    const state = reactive<WalletState>({
      walletAddress: undefined,
      chainId: undefined
    })
    provide(WalletSymbol, readonly(state))
    return () => ctx.slots.default?.()
  }
})

export function useWallet() {
  const state = inject(WalletSymbol)
  if (!state) {
    throw new Error('useWallet should be used inside WalletProvider.')
  }

  function setWallet(walletAddress: string, chainId: string) {
    state.walletAddress = walletAddress
    state.chainId = chainId
  }

  return { ...state, setWallet }
}
