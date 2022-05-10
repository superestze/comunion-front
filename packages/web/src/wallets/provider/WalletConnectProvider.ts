import WCProvider from '@walletconnect/web3-provider'
import { ethers } from 'ethers'
const logger = new ethers.utils.Logger('0.1.0')

// currently Web3Provider not support account event
// and MetamaskProvider is experimental ant not support network event
// so we need to poll for account change
export class WalletConnectProvider extends ethers.providers.Web3Provider {
  _wcProvider: WCProvider
  constructor(opt: ConstructorParameters<typeof WCProvider>[0]) {
    const provider = new WCProvider(opt)
    super(provider, 'any')
    this._wcProvider = provider
    logger.info('Custom WalletConnectProvider')
    // TODO not working
    provider.on('accountsChanged', (accounts: string[]) => {
      this.emit('account', accounts[0])
    })

    // Subscribe to chainId change
    // TODO not working
    provider.on('chainChanged', (chainId: number) => {
      this.emit('network', chainId)
    })

    // Subscribe to session disconnection
    provider.on('disconnect', (code: number, reason: string) => {
      this.emit('account', undefined)
    })
  }
}
