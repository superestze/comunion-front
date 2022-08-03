import { allNetworks } from '@/constants'

export const getChainInfoByChainId = (chainId: number) => {
  return allNetworks.find(network => network.chainId === chainId)
}
