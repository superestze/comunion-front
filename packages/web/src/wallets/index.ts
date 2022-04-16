import type AbstractWallet from './AbstractWallet'
import MetamaskWallet from './Metamask'
import WalletConnectWallet from './WalletConnect'
import type { SupportedWalletTypes } from '@/types/wallet'

export async function getWallet(
  walletName: SupportedWalletTypes
): Promise<AbstractWallet | undefined> {
  const wallet = walletName === 'WalletConnect' ? new WalletConnectWallet() : new MetamaskWallet()
  if (wallet.checkAvaliable()) {
    try {
      await wallet.prepare()
      return wallet
    } catch (error) {
      console.error('Error when auto init', error)
    }
  }
  return undefined
}
