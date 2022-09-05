import { hexlify } from 'ethers/lib/utils'
import AbstractWallet from './AbstractWallet'
import { CoinbaseWalletProvider } from './provider/CoinbaseWalletProvider'
import { allNetworks, ChainNetworkType } from '@/constants'

let _instance: CoinbaseWallet | undefined

export default class CoinbaseWallet extends AbstractWallet {
  static _CoinbaseWalletProvider: any = new CoinbaseWalletProvider()
  constructor() {
    super('CoinbaseWallet', CoinbaseWallet._CoinbaseWalletProvider)
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
    return !!this._CoinbaseWalletProvider.ethereum
  }
  prepare() {
    return CoinbaseWallet._CoinbaseWalletProvider.ethereum.request?.({
      method: 'eth_requestAccounts'
    })
  }
  async addNetwork(network: ChainNetworkType): Promise<boolean> {
    if (!CoinbaseWallet._CoinbaseWalletProvider.ethereum) return Promise.resolve(false)
    try {
      await CoinbaseWallet._CoinbaseWalletProvider.ethereum.request!({
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
      await CoinbaseWallet._CoinbaseWalletProvider.ethereum.request!({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexlify(chainId) }]
      })
      return true
    } catch (e: any) {
      if (e.code === 4902) {
        const added = await this.addNetwork(allNetworks.find(n => n.chainId === chainId)!)
        if (added) {
          return this.switchNetwork(chainId)
        }
        return false
      }
      console.error(e)
      return false
    }
  }
}
