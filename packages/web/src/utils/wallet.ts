import { message } from '@comunion/components'
import { useWalletStore } from '@/stores'
import { getChainInfoByChainId } from '@/utils/etherscan'

// Check wallet network against chainId
export async function checkSupportNetwork(chainId: number, callback?: () => void) {
  const walletStore = useWalletStore()
  const chainInfo = getChainInfoByChainId(chainId)
  if (chainId && walletStore.chainId !== chainId) {
    message.warning(`Please switch to ${chainInfo?.name}`)
    // not supported network, try to switch
    walletStore.openNetworkSwitcher()
    walletStore.wallet?.switchNetwork(chainId).then(res => {
      if (res && typeof callback === 'function') callback()
    })
    return false
  } else {
    typeof callback === 'function' && callback()
    return true
  }
}
