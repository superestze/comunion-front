import { message } from '@comunion/components'
import { storage } from '@comunion/utils'
import type { providers } from 'ethers'
import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import { useUserStore } from './user'
import {
  STORE_KEY_WALLET_CONNECTED,
  STORE_KEY_WALLET_TYPE,
  allNetworks,
  supportedChainIds
} from '@/constants'
import router from '@/router'
import { ServiceReturn, services } from '@/services'
import { SupportedWalletTypes } from '@/types/wallet'
import { getWallet } from '@/wallets'
import AbstractWallet from '@/wallets/AbstractWallet'

export type WalletState = {
  // inited
  inited: boolean
  // wallet address
  address?: string
  // current chain id
  chainId?: number
  // current chain name
  chainName?: string
  // connected wallet type
  walletType?: SupportedWalletTypes
  // wallet instance
  wallet?: AbstractWallet
  // is wallet connected
  connected: boolean
  // is wallet connect modal opened
  connectModalOpened: boolean
  // bind wallet modal opened
  bindModalOpened: boolean
}

// promise resolve
let _resolve: (() => void) | undefined
let _reject: (() => void) | undefined
// bind cb
let bindCbSuccess!: (params: ServiceReturn<'account@wallet-link'>) => void
let bindCbFailed!: () => void
// hack
let _openNetworkSwitcher: () => void | undefined

export const useWalletStore = defineStore('wallet', {
  state: (): WalletState => ({
    inited: false,
    address: undefined,
    chainId: undefined,
    chainName: undefined,
    walletType: storage('local').get<NonNullable<WalletState['walletType']>>(STORE_KEY_WALLET_TYPE),
    connected: false,
    wallet: undefined,
    connectModalOpened: false,
    bindModalOpened: false
  }),
  getters: {
    isNetworkSupported: state =>
      state.chainId ? supportedChainIds.includes(state.chainId) : false,
    blockchainExplorerUrl: state => allNetworks.find(n => n.chainId === state.chainId)?.explorerUrl
  },
  actions: {
    async init() {
      if (this.inited) return
      const isConnected = storage('local').get<string>(STORE_KEY_WALLET_CONNECTED)
      // auto connect when previous session is connected
      if (isConnected && this.walletType) {
        const wallet = await getWallet(this.walletType)
        if (wallet) {
          this._onWallectConnect(wallet)
        }
      }
      this.inited = true
    },
    async _onWallectConnect(wallet: AbstractWallet) {
      this.wallet = markRaw(wallet)
      this.connected = true
      this.address = await wallet.getAddress()
      const network = await wallet.getProvider().getNetwork()
      this.chainId = network.chainId
      this.chainName = network.name
      this._addEventListeners(this.wallet.getProvider())
    },
    _addEventListeners(provider: providers.JsonRpcProvider) {
      provider.on('account', this._onAccountsChanged)
      provider.on('network', this._onNetworkChange)
    },
    _removeEventListeners() {
      const provider = this.wallet?.getProvider()
      if (provider) {
        provider.off('account', this._onAccountsChanged)
        provider.off('network', this._onNetworkChange)
      }
    },
    _onAccountsChanged(account: string, oldAccount: string) {
      const userStore = useUserStore()
      // change address means change user, so we need to disconnect
      console.log('You have changed the account', account, oldAccount)
      if (account) {
        this.address = account
      } else {
        this.disconnectWallet()
      }
      // account switched
      if (
        account &&
        oldAccount &&
        account !== oldAccount &&
        window.location.pathname !== '/auth/login'
      ) {
        message.info('Account switched, please re-login')
        userStore.onLogout()
        router.replace('/auth/login')
      }
    },
    disconnectWallet() {
      this.connected = false
      storage('local').remove(STORE_KEY_WALLET_CONNECTED)
      this.address = undefined
      this.chainId = undefined
      this.chainName = undefined
      this.walletType = undefined
      storage('local').remove(STORE_KEY_WALLET_TYPE)
      this.wallet = undefined
      this._removeEventListeners()
    },
    async _onNetworkChange(newNetwork: string, oldNetwork: string) {
      console.log('You have changed the network', newNetwork, oldNetwork)
      const network = await this.wallet!.getProvider().getNetwork()
      this.chainId = network.chainId
      this.chainName = network.name
    },
    openConnectModal() {
      this.connectModalOpened = true
    },
    closeConnectModal() {
      this.connectModalOpened = false
      this.resolveWalletConnect(false)
    },
    async onSelectWallet(walletType: SupportedWalletTypes) {
      const wallet = await getWallet(walletType)
      if (wallet) {
        this._onWallectConnect(wallet)
        storage('local').set(STORE_KEY_WALLET_TYPE, walletType)
        storage('local').set(STORE_KEY_WALLET_CONNECTED, 1)
      }
      this.connectModalOpened = false
      return wallet
    },
    resolveWalletConnect(resolved: boolean) {
      if (resolved) {
        _resolve?.()
        _resolve = undefined
      } else {
        _reject?.()
        _reject = undefined
      }
    },
    async ensureWalletConnected(force = false) {
      if (!this.connected || force) {
        this.openConnectModal()
        return new Promise<void>((resolve, reject) => {
          _resolve = resolve
          _reject = reject
        })
      }
    },
    openBindModal() {
      this.bindModalOpened = true
      return new Promise<ServiceReturn<'account@wallet-link'> | null>((resolve, reject) => {
        bindCbSuccess = resolve
        bindCbFailed = reject
      })
    },
    closeBindModal() {
      this.bindModalOpened = false
    },
    async bindWallet(wallet: AbstractWallet) {
      const address = await wallet.getAddress()
      const userStore = useUserStore()
      const { error, data } = await services['account@wallet-nonce-get']({
        address
      })
      if (!error) {
        try {
          const signature = await wallet.sign(data!.nonce!)
          return new Promise(() => {
            services['account@wallet-link']({
              address,
              signature
            }).then(response => {
              if (response.error) {
                if (bindCbFailed && typeof bindCbFailed === 'function') {
                  bindCbFailed()
                }
                return
              }
              if (bindCbSuccess && typeof bindCbSuccess === 'function') {
                bindCbSuccess(response.data)
              }
              this.closeBindModal()
              userStore.refreshMe()
            })
          })
        } catch (error) {
          console.error('Wallet sign errored')
          return
        }
      }
    },
    // open network switcher
    openNetworkSwitcher() {
      _openNetworkSwitcher?.()
    },
    // set network switcher function
    setOpenNetworkSwitcher(fn: () => void) {
      _openNetworkSwitcher = fn
    }
  }
})

export type WalletStore = ReturnType<typeof useWalletStore>
