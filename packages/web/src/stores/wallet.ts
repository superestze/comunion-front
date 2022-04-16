import { readObject, removeObject, storeObject } from '@comunion/utils'
import type { providers } from 'ethers'
import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import { STORE_KEY_WALLET_CONNECTED, STORE_KEY_WALLET_TYPE } from '@/constants'
import { SupportedWalletTypes } from '@/types/wallet'
import { getWallet } from '@/wallets'
import AbstractWallet from '@/wallets/AbstractWallet'

export type WalletState = {
  // inited
  inited: boolean
  // wallet address
  address?: string
  // current chain name
  chainName?: string
  // current chain id
  chainId?: number
  // connected wallet type
  walletType?: SupportedWalletTypes
  // wallet instance
  wallet?: AbstractWallet
  // is wallet connected
  connected: boolean
  // is wallet connect modal opened
  connectModalOpened: boolean
}

// promise resolve
let _resolve: (() => void) | undefined
let _reject: (() => void) | undefined

export const useWalletStore = defineStore('wallet', {
  state: (): WalletState => ({
    inited: false,
    address: undefined,
    chainId: undefined,
    chainName: undefined,
    walletType: readObject<NonNullable<WalletState['walletType']>>(STORE_KEY_WALLET_TYPE),
    connected: false,
    wallet: undefined,
    connectModalOpened: false
  }),
  actions: {
    async init() {
      if (this.inited) return
      const isConnected = readObject<string>(STORE_KEY_WALLET_CONNECTED)
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
    // TODO
    _onAccountsChanged(account: string, oldAccount: string) {
      // change address means change user, so we need to disconnect
      console.log('You have changed the account', account, oldAccount)
      if (account) {
        this.address = account
      } else {
        this._onWalletDisconnected()
      }
      // TODO
    },
    _onWalletDisconnected() {
      this.connected = false
      removeObject(STORE_KEY_WALLET_CONNECTED)
      this.address = undefined
      this.chainId = undefined
      this.chainName = undefined
      this.walletType = undefined
      removeObject(STORE_KEY_WALLET_TYPE)
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
    async onSelectWallet(walletType: SupportedWalletTypes) {
      const wallet = await getWallet(walletType)
      if (wallet) {
        this._onWallectConnect(wallet)
        storeObject(STORE_KEY_WALLET_TYPE, walletType)
        storeObject(STORE_KEY_WALLET_CONNECTED, 1)
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
    async ensureWalletConnected() {
      if (!this.connected) {
        this.openConnectModal()
        return new Promise<void>((resolve, reject) => {
          _resolve = resolve
          _reject = reject
        })
      }
    }
  }
})
