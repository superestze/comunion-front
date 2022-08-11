import { allNetworks } from '@/constants'

export const getChainInfoByChainId = (chainId: number) => {
  return allNetworks.find(network => network.chainId === chainId)
}

export enum CrowdfundingStatus {
  UPCOMING = 1,
  LIVE = 2,
  ENDED = 3,
  CANCELED = 4
}
