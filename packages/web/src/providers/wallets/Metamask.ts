import { providers } from 'ethers'
import AbstractWallet from './Wallet'

export default class MetamaskWallet extends AbstractWallet {
  constructor() {
    super('Metamask', new providers.Web3Provider(window.ethereum))
  }
  checkAvaliable(): boolean {
    return !!window.ethereum
  }
  prepare(): void | Promise<void> {
    return window.ethereum.request({ method: 'eth_requestAccounts' })
  }
}
