import { message } from '@comunion/components'
import { useWalletStore } from '@/stores'
import { getChainInfoByChainId } from '@/utils/etherscan'

// Check wallet network against chainId
export async function checkSupportNetwork(chainId: number) {
  const walletStore = useWalletStore()
  const chainInfo = getChainInfoByChainId(chainId)
  if (chainId && walletStore.chainId !== chainId) {
    walletStore.wallet?.switchNetwork(chainId)
    message.warning(`Please switch to ${chainInfo?.name}`)
    // not supported network, try to switch
    walletStore.openNetworkSwitcher()
    return false
  } else {
    return true
  }
}
