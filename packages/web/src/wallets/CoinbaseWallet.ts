import { hexlify } from 'ethers/lib/utils'
import AbstractWallet from './AbstractWallet'
import { CoinbaseWalletProvider } from './provider/CoinbaseWalletProvider'
import { allNetworks, ChainNetworkType } from '@/constants'

let _instance: CoinbaseWallet | undefined

export default class CoinbaseWallet extends AbstractWallet {
  _coinbaseWalletProvider: any = new CoinbaseWalletProvider()
  constructor() {
    const _coinbaseWalletProvider = new CoinbaseWalletProvider()
    super('CoinbaseWallet', _coinbaseWalletProvider)
    this._coinbaseWalletProvider = _coinbaseWalletProvider
  }

  static getInstance(): AbstractWallet | undefined {
    if (!_instance) {
      if (!CoinbaseWallet.checkAvaliable()) {
        window.open(
          'https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad',
          'CoinbaseWallet'
        )
        return undefined
      }
      _instance = new CoinbaseWallet()
    }
    return _instance
  }

  static checkAvaliable(): boolean {
    return !!window.ethereum
  }
  prepare() {
    return this._coinbaseWalletProvider.ethereum.request?.({
      method: 'eth_requestAccounts'
    })
  }
  async addNetwork(network: ChainNetworkType): Promise<boolean> {
    if (!this._coinbaseWalletProvider.ethereum) return Promise.resolve(false)
    try {
      await this._coinbaseWalletProvider.ethereum.request!({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: hexlify(network.chainId),
            chainName: network.name,
            nativeCurrency: {
              name: network.currencySymbol,
              symbol: network.currencySymbol,
              decimals: 18
            },
            rpcUrls: [network.rpcUrl],
            blockExplorerUrls: [network.explorerUrl],
            iconUrls: []
          }
        ]
      })
      return true
    } catch (addError) {
      console.error(addError)
      return false
    }
  }
  async switchNetwork(chainId: number): Promise<boolean> {
    try {
      await this._coinbaseWalletProvider.ethereum.request!({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexlify(chainId) }]
      })
      return true
    } catch (e: any) {
      if (e.code === 4902) {
        await this.addNetwork(allNetworks.find(n => n.chainId === chainId)!)
        // if (added) {
        //   return this.switchNetwork(chainId)
        // }
        return false
      }
      console.error(e)
      return false
    }
  }
}
