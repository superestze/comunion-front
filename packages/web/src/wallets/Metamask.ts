import AbstractWallet from './AbstractWallet'
import { MetamaskProvider } from './provider/MetamaskProvider'

export default class MetamaskWallet extends AbstractWallet {
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
