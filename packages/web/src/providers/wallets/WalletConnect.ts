import { providers } from 'ethers'
import WalletConnectProvider from '@walletconnect/ethereum-provider'
import AbstractWallet from './Wallet'

export default class WalletConnectWallet extends AbstractWallet {
  walletConnectProvider: WalletConnectProvider
  constructor() {
    const walletConnectProvider = new WalletConnectProvider({
      // export const infuraNetworks = {
      //   1: "mainnet",
      //   3: "ropsten",
      //   4: "rinkeby",
      //   5: "goerli",
      //   42: "kovan",
      // };
      chainId: 1,
      client: {
        logger: 'debug',
        relayUrl: 'wss://relay.walletconnect.com',
        projectId: 'e6df27a37720674f7f88a859dd72a026'
      }
    })
    super('WalletConnect', new providers.Web3Provider(walletConnectProvider))
    this.walletConnectProvider = walletConnectProvider
  }
  checkAvaliable(): boolean {
    return true
  }
  prepare(): any | Promise<any> {
    return this.walletConnectProvider.connect()
    // return this.walletConnectProvider.enable()
  }
}
