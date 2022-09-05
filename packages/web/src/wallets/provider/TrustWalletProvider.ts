import { ethers } from 'ethers'
const logger = new ethers.utils.Logger('0.1.0')

// currently Web3Provider not support account event
// and MetamaskProvider is experimental ant not support network event
// so we need to poll for account change
export class TrustWalletProvider extends ethers.providers.Web3Provider {
  constructor(opt: ethers.providers.ExternalProvider) {
    super(opt)
  }
}
