import { allNetworks } from '@/constants'

export const goTxHashPath = (chainId: number, address: string) => {
  let url = ''
  allNetworks.forEach(item => {
    if (item.chainId === chainId) {
      url = item.explorerUrl
    }
  })
  if (url) {
    window.open(`${url}/tx/${address}`, address)
  }
}
