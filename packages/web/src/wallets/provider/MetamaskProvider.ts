import { ethers } from 'ethers'
const logger = new ethers.utils.Logger('0.1.0')

// currently Web3Provider not support account event
// and MetamaskProvider is experimental ant not support network event
// so we need to poll for account change
export class MetamaskProvider extends ethers.providers.Web3Provider {
  _polling: number | undefined
  _account: string | undefined

  constructor(ethereum?: ethers.providers.ExternalProvider | unknown) {
    if (!window.ethereum) {
      logger.throwError(
        'could not auto-detect global.ethereum',
        ethers.errors.UNSUPPORTED_OPERATION,
        {
          operation: 'window.ethereum'
        }
      )
    }

    // any is needed because of ethers.js
    // https://github.com/ethers-io/ethers.js/issues/899#issuecomment-646945824
    super((ethereum as ethers.providers.ExternalProvider)!, 'any')
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
