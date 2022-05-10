import AbstractWallet from './AbstractWallet'
import { WalletConnectProvider } from './provider/WalletConnectProvider'
import { ChainNetworkType } from '@/constants'

let _instance: WalletConnectWallet | undefined
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
    super('WalletConnect', provider)
    this.walletConnectProvider = provider
  }
  static getInstance(): AbstractWallet | undefined {
    if (!_instance) {
      _instance = new WalletConnectWallet()
    }
    return _instance
  }
  static checkAvaliable(): boolean {
    return true
  }
  async prepare() {
    try {
      const addressList = await this.walletConnectProvider._wcProvider.enable()
      return addressList?.[0]
    } catch (error) {
      return undefined
    }
  }
  addNetwork(network: ChainNetworkType): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
  switchNetwork(chainId: number): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}
