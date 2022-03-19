import { InjectionKey, ref, defineComponent, inject, readonly, provide, reactive } from 'vue'
import type { WalletConnectFunction } from './wallets'
import { connect } from './wallets'
import type AbstractWallet from './wallets/Wallet'
import WalletLoginBlock from '@/blocks/WalletConnect'
import type { UserResponse } from '@/types'

export interface WalletState {
  walletAddress?: string
  chainId?: string
}

export const WalletSymbol: InjectionKey<{
  wallet: WalletState
  getWallet: () => AbstractWallet
  connectWallet: (...args: Parameters<WalletConnectFunction>) => Promise<UserResponse | undefined>
  ensureWalletConnected: (needLogin?: boolean) => Promise<void>
}> = Symbol()

export const WalletProvider = defineComponent({
  name: 'WalletProvider',
  setup(props, ctx) {
    const walletModalVisible = ref(false)
    const needLogin = ref(false)
    const state = reactive<WalletState>({
      walletAddress: undefined,
      chainId: undefined
    })

    let _wallet: AbstractWallet | undefined = null
    let _resolve: () => void

    async function connectWallet(...args: Parameters<WalletConnectFunction>) {
      const { user, address, wallet } = await connect(...args)
      _wallet = wallet
      // console.log(_wallet)
      state.walletAddress = address
      state.chainId = (await wallet.getProvider().getNetwork()).name
      return user
    }

    function onWalletConnected() {
      _resolve()
    }

    provide(WalletSymbol, {
      wallet: readonly(state),
      getWallet: () => _wallet,
      connectWallet,
      ensureWalletConnected: async _needLogin => {
        if (!_wallet) {
          walletModalVisible.value = true
          needLogin.value = _needLogin
          return new Promise(resolve => {
            _resolve = resolve
          })
        }
        return Promise.resolve()
      }
    })
    return () => (
      <>
        {ctx.slots.default?.()}
        <WalletLoginBlock
          needLogin={needLogin.value}
          v-model:visible={walletModalVisible.value}
          onConnected={onWalletConnected}
        />
      </>
    )
  }
})

export function useWallet() {
  const state = inject(WalletSymbol)
  if (!state) {
    throw new Error('useWallet should be used inside WalletProvider.')
  }

  return state
}
