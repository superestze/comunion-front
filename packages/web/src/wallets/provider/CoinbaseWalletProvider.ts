import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import { ethers } from 'ethers'
const logger = new ethers.utils.Logger('0.1.0')
// currently Web3Provider not support account event
// and MetamaskProvider is experimental ant not support network event
// so we need to poll for account change
export class CoinbaseWalletProvider extends ethers.providers.Web3Provider {
  ethereum: any
  constructor() {
    const APP_NAME = 'comunion'
    const APP_LOGO_URL = ''
    const DEFAULT_ETH_JSONRPC_URL = 'http://localhost:9001/7092762b512b4153bb32ddeea134bfb8'
    const DEFAULT_CHAIN_ID = 1
    // // Initialize Coinbase Wallet SDK
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
}
