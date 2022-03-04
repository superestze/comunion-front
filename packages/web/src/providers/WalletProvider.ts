import type { InjectionKey } from 'vue'
import { defineComponent, inject, readonly, provide, reactive } from 'vue'
import type { WalletLoginFunction } from './wallets'
import { login } from './wallets'
import type AbstractWallet from './wallets/Wallet'
import type { UserResponse } from '@/types'

export interface WalletState {
  walletAddress?: string
  chainId?: string
}

export const WalletSymbol: InjectionKey<{
  wallet: WalletState
  getWallet: () => AbstractWallet
  walletLogin: (...args: Parameters<WalletLoginFunction>) => Promise<UserResponse>
}> = Symbol()

export const WalletProvider = defineComponent({
  name: 'WalletProvider',
  setup(props, ctx) {
    const state = reactive<WalletState>({
      walletAddress: undefined,
      chainId: undefined
    })

    let _wallet: AbstractWallet | undefined = null

    async function walletLogin(...args: Parameters<WalletLoginFunction>) {
      const { user, wallet } = await login(...args)
      _wallet = wallet
      console.log(_wallet)
      state.walletAddress = user.address
      state.chainId = (await wallet.getProvider().getNetwork()).name
      return user
    }

    provide(WalletSymbol, {
      wallet: readonly(state),
      getWallet: () => _wallet,
      walletLogin
    })
    return () => ctx.slots.default?.()
  }
})

export function useWallet() {
  const state = inject(WalletSymbol)
  if (!state) {
    throw new Error('useWallet should be used inside WalletProvider.')
  }

  return state
}
