import { hexlify } from 'ethers/lib/utils'
import AbstractWallet from './AbstractWallet'
import { MetamaskProvider } from './provider/MetamaskProvider'
import { allNetworks, ChainNetworkType } from '@/constants'
let _instance: MetamaskWallet | undefined

export default class MetamaskWallet extends AbstractWallet {
  constructor() {
    super('Metamask', new MetamaskProvider(window.ethereum))
  }

  static getInstance(): AbstractWallet | undefined {
    if (!_instance) {
      if (!MetamaskWallet.checkAvaliable()) {
        window.open('https://metamask.io/', 'metamask')
        return undefined
      }
      _instance = new MetamaskWallet()
    }
    return _instance
  }

  static checkAvaliable(): boolean {
    return !!(<any>globalThis).ethereum
  }
  prepare() {
    return (<any>globalThis).ethereum.request?.({ method: 'eth_requestAccounts' })
  }
  async addNetwork(network: ChainNetworkType): Promise<boolean> {
    if (!window.ethereum) return Promise.resolve(false)
    try {
      await (<any>globalThis).ethereum.request!({
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
      await (<any>globalThis).ethereum.request!({
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
