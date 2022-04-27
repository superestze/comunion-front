import avalanche from '@/assets/avalanche.png'
import bsc from '@/assets/bsc.png'
import ethereum from '@/assets/ethereum-eth-logo.png'
import fantom from '@/assets/fantom.png'
import polygon from '@/assets/polygon.png'

/**
 * https://chainlist.org/
 */
export const networks = [
  {
    name: 'Ethereum',
    logo: ethereum,
    chainId: 1
  },
  {
    name: 'Avalanche',
    logo: avalanche,
    chainId: 43114,
    disabled: true
  },
  {
    name: 'Fantom',
    logo: fantom,
    chainId: 250,
    disabled: true
  },
  {
    name: 'BSC',
    logo: bsc,
    chainId: 56,
    disabled: true
  },
  {
    name: 'Polygon',
    logo: polygon,
    chainId: 137,
    disabled: true
  }
]
