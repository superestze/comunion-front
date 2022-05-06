import { hexlify } from 'ethers/lib/utils'
import AbstractWallet from './AbstractWallet'
import { MetamaskProvider } from './provider/MetamaskProvider'
import { allNetworks, ChainNetworkType } from '@/constants'

export default class MetamaskWallet extends AbstractWallet {
  async addNetwork(network: ChainNetworkType): Promise<boolean> {
    if (!window.ethereum) return Promise.resolve(false)
    try {
      await window.ethereum.request!({
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
      await window.ethereum.request!({
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
  constructor() {
    super('Metamask', new MetamaskProvider(window.ethereum))
  }
  checkAvaliable(): boolean {
    return !!window.ethereum
  }
  prepare() {
    return window.ethereum.request?.({ method: 'eth_requestAccounts' })
  }
}
