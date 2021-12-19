import { services } from '@/services'
import MetamaskWallet from './Metamask'
import type AbstractWallet from './Wallet'
import WalletConnectWallet from './WalletConnect'

export async function login(walletName: 'Metamask' | 'WalletConnect') {
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
        throw new Error('User rejected')
      }
      const { error: error2, data: data2 } = await services['account@wallet-login']({
        address,
        signature: signedMsg
      })
      if (!error2) {
        // TODO: logged
        console.log(data2)
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
