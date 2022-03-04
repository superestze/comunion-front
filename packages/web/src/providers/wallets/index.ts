import MetamaskWallet from './Metamask'
import type AbstractWallet from './Wallet'
import WalletConnectWallet from './WalletConnect'
import { services } from '@/services'
import type { UserResponse } from '@/types'

export type WalletLoginFunction = (walletName: 'Metamask' | 'WalletConnect') => Promise<{
  user?: UserResponse
  wallet: AbstractWallet
}>

export const login: WalletLoginFunction = async walletName => {
  const wallet: AbstractWallet =
    walletName === 'Metamask' ? new MetamaskWallet() : new WalletConnectWallet()
  if (wallet.checkAvaliable()) {
    try {
      await wallet.prepare()
    } catch (error) {
      throw new Error('Login failed when prepare')
    }
    const address = await wallet.getAddress()
    const { error, data } = await services['account@wallet-nonce-get']({
      address
    })
    if (!error) {
      let signedMsg
      try {
        signedMsg = await wallet.sign(data.nonce)
      } catch (error) {
        throw new Error('Wallet sign errored')
      }
      const { error: error2, data: data2 } = await services['account@wallet-login']({
        address,
        signature: signedMsg
      })
      if (!error2) {
        return {
          user: data2,
          wallet
        }
      } else {
        throw new Error('Login failed when parse signature')
      }
    } else {
      throw new Error('Login failed when get nonce')
    }
  } else {
    throw new Error(`Can't login with ${walletName}`)
  }
}
