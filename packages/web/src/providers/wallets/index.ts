import MetamaskWallet from './Metamask'
import type AbstractWallet from './Wallet'
import WalletConnectWallet from './WalletConnect'
import { services } from '@/services'
import type { UserResponse } from '@/types'

export type WalletConnectFunction = (
  walletName: 'MetaMask' | 'WalletConnect',
  needLogin?: boolean
) => Promise<{
  user?: UserResponse
  address: string
  wallet: AbstractWallet
}>

export const connect: WalletConnectFunction = async (walletName, needLogin = false) => {
  const wallet: AbstractWallet =
    walletName === 'MetaMask' ? new MetamaskWallet() : new WalletConnectWallet()
  if (wallet.checkAvaliable()) {
    try {
      await wallet.prepare()
    } catch (error) {
      throw new Error('Login failed when prepare')
    }
    const address = await wallet.getAddress()
    if (needLogin) {
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
            address,
            wallet
          }
        } else {
          throw new Error('Login failed when parse signature')
        }
      } else {
        throw new Error('Login failed when get nonce')
      }
    } else {
      return { wallet, address }
    }
  } else {
    throw new Error(`Can't connect with ${walletName}`)
  }
}
