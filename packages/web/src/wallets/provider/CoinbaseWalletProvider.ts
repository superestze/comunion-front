import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import { ethers } from 'ethers'
import { WALLET_INFURA_ID } from '@/constants'
const logger = new ethers.utils.Logger('0.1.0')
// currently Web3Provider not support account event
// and MetamaskProvider is experimental ant not support network event
// so we need to poll for account change
export class CoinbaseWalletProvider extends ethers.providers.Web3Provider {
  ethereum: ethers.providers.ExternalProvider
  _polling: number | undefined
  _account: string | undefined
  constructor() {
    const coinbaseWindow = (window.ethereum as { providers: Array<{ getChainId: () => number }> })
      .providers[0]
    const APP_NAME = 'comunion'
    const APP_LOGO_URL = ''
    // url and infuraId (https://infura.io/zh)
    // const DEFAULT_ETH_JSONRPC_URL = `https://mainnet.infura.io/v3//${WALLET_INFURA_ID}`
    const DEFAULT_ETH_JSONRPC_URL = `https://mainnet.infura.io/v3/${WALLET_INFURA_ID}`
    const DEFAULT_CHAIN_ID = coinbaseWindow.getChainId()
    // Initialize Coinbase Wallet SDK
    const coinbaseWallet = new CoinbaseWalletSDK({
      appName: APP_NAME,
      appLogoUrl: APP_LOGO_URL,
      darkMode: false
    })
    // // Initialize a Web3 Provider object
    const ethereum: any = coinbaseWallet.makeWeb3Provider(DEFAULT_ETH_JSONRPC_URL, DEFAULT_CHAIN_ID)
    super(ethereum!, 'any')
    this.ethereum = ethereum
    logger.info('init coinbaseWalletProvider')
  }
  getEthereum() {
    return this.ethereum
  }
  _startPollingAccount() {
    this._polling = window.setTimeout(async () => {
      try {
        const account = await this.getSigner().getAddress()
        if (account !== this._account) {
          this.emit('account', account, this._account)
          this._account = account
        }
        this._startPollingAccount()
      } catch (error) {
        // account disconnected
        this.emit('account', undefined, this._account)
        this._account = undefined
      }
    }, 1000)
  }
  _stopPollingAccount() {
    if (this._polling) {
      window.clearTimeout(this._polling)
    }
  }

  on(eventName: ethers.providers.EventType, listener: ethers.providers.Listener): this {
    super.on(eventName, listener)
    if (this.listenerCount('account') > 0) {
      this._startPollingAccount()
    }
    return this
  }

  off(eventName: ethers.providers.EventType, listener?: ethers.providers.Listener): this {
    super.off(eventName, listener)
    if (this.listenerCount('account') === 0) {
      this._stopPollingAccount()
    }
    return this
  }
}
