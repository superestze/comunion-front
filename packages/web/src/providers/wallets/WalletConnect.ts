import WalletConnectProvider from '@walletconnect/web3-provider'
import { providers } from 'ethers'
import AbstractWallet from './Wallet'

export default class WalletConnectWallet extends AbstractWallet {
  walletConnectProvider: WalletConnectProvider
  constructor() {
    // const walletConnectProvider = new WalletConnectProvider({
    //   // export const infuraNetworks = {
    //   //   1: "mainnet",
    //   //   3: "ropsten",
    //   //   4: "rinkeby",
    //   //   5: "goerli",
    //   //   42: "kovan",
    //   // };
    //   chainId: 1,
    //   client: {
    //     logger: 'debug',
    //     relayUrl: 'wss://relay.walletconnect.com',
    //     projectId: 'e6df27a37720674f7f88a859dd72a026'
    //   }
    // })
    const provider = new WalletConnectProvider({
      // infuraId: '27e484dcd9e3efcfd25a83a78777cdf1'
      // infuraId: 'e6df27a37720674f7f88a859dd72a026'
      infuraId: '7092762b512b4153bb32ddeea134bfb8'
    })
    super('WalletConnect', new providers.Web3Provider(provider))
    this.walletConnectProvider = provider
  }
  checkAvaliable(): boolean {
    return true
  }
  prepare(): any | Promise<any> {
    return this.walletConnectProvider.enable()
    // return this.walletConnectProvider.enable()
  }
}
