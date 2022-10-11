import avalanche from '@/assets/networks/avalanche.svg'
import binance from '@/assets/networks/binance.svg'
import ethereum from '@/assets/networks/ethereum.svg'
import fantom from '@/assets/networks/fantom.svg'
import noavalanche from '@/assets/networks/noavalanche.svg'
import nobinance from '@/assets/networks/nobinance.svg'
import noethereum from '@/assets/networks/noethereum.svg'
import nofantom from '@/assets/networks/nofantom.svg'
import nopolygon from '@/assets/networks/nopolygon.svg'
import nosyscoin from '@/assets/networks/nosyscoin.svg'
import polygon from '@/assets/networks/polygon.svg'
import syscoin from '@/assets/networks/syscoin.svg'
/**
 * https://chainlist.org/
 */

export type ChainNetworkType = {
  logo: string
  nologo?: string
  chainId: number
  name: string
  shortName?: string
  currencySymbol: string
  rpcUrl: string
  explorerUrl: string
  chain_contracts?: Array<{
    project: number
    address: string
    abi: string
  }>
}

/**
 * All networks we want to support
 * (Ethereum、BNB Smart Chain、Avalanche、Fantom Opera) use
 */
export const allNetworks: ChainNetworkType[] = [
  {
    logo: ethereum,
    nologo: noethereum,
    chainId: 1,
    name: 'Ethereum',
    shortName: 'Ethereum',
    currencySymbol: 'ETH',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    explorerUrl: 'https://etherscan.io'
  },
  {
    logo: ethereum,
    nologo: noethereum,
    chainId: 5,
    name: 'Goerli Testnet',
    shortName: 'Goerli Testnet',
    currencySymbol: 'ETH',
    rpcUrl: 'https://goerli.infura.io/v3/',
    explorerUrl: 'https://goerli.etherscan.io'
  },
  {
    logo: avalanche,
    nologo: noavalanche,
    chainId: 43114,
    name: 'Avalanche C-Chain',
    shortName: 'Avalanche',
    currencySymbol: 'AVAX',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorerUrl: 'https://snowtrace.io'
  },
  {
    logo: avalanche,
    nologo: noavalanche,
    chainId: 43113,
    name: 'Avalanche Fuji Testnet',
    shortName: 'Avalanche Testnet',
    currencySymbol: 'AVAX',
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    explorerUrl: 'https://cchain.explorer.avax-test.network'
  },
  {
    logo: fantom,
    nologo: nofantom,
    chainId: 250,
    name: 'Fantom Opera',
    shortName: 'Fantom',
    currencySymbol: 'FTM',
    rpcUrl: 'https://rpc.ftm.tools',
    explorerUrl: 'https://ftmscan.com'
  },
  {
    logo: fantom,
    nologo: nofantom,
    chainId: 4002,
    name: 'Fantom Testnet',
    shortName: 'Fantom',
    currencySymbol: 'FTM',
    rpcUrl: 'https://rpc.testnet.fantom.network',
    explorerUrl: 'https://testnet.ftmscan.com'
  },
  {
    logo: binance,
    nologo: nobinance,
    chainId: 56,
    name: 'Binance Smart Chain Mainnet',
    shortName: 'BSC',
    currencySymbol: 'BNB',
    rpcUrl: 'https://bsc-dataseed1.binance.org',
    explorerUrl: 'https://bscscan.com'
  },
  {
    logo: binance,
    nologo: nobinance,
    chainId: 97,
    name: 'Binance Smart Chain Testnet',
    shortName: 'BSC Testnet',
    currencySymbol: 'tBNB',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    explorerUrl: 'https://testnet.bscscan.com'
  },
  {
    logo: polygon,
    nologo: nopolygon,
    chainId: 137,
    name: 'Polygon Mainnet',
    shortName: 'Polygon',
    currencySymbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com'
  },
  {
    logo: polygon,
    nologo: nopolygon,
    chainId: 80001,
    name: 'Mumbai',
    shortName: 'Mumbai',
    currencySymbol: 'MATIC',
    rpcUrl: 'https://matic-mumbai.chainstacklabs.com',
    explorerUrl: 'https://mumbai.polygonscan.com'
  },
  {
    logo: syscoin,
    nologo: nosyscoin,
    chainId: 2814,
    name: 'Rollux OPv1 Private',
    shortName: 'Rollux',
    currencySymbol: 'RSYS',
    rpcUrl: 'https://testnet.rollux.com:2814',
    explorerUrl: 'https://explorer.testnet.rollux.com'
  },
  {
    logo: syscoin,
    nologo: nosyscoin,
    chainId: 57,
    name: 'Syscoin Mainnet',
    shortName: 'Syscoin',
    currencySymbol: 'USDC',
    rpcUrl: 'https://rpc.ankr.com/syscoin',
    explorerUrl: 'https://explorer.syscoin.org'
  }
]
interface NETWORKS_COLOR_MAP_TYPE {
  [key: string]: string
}

export const NETWORKS_COLOR_MAP: NETWORKS_COLOR_MAP_TYPE = {
  Polygon: '#8247E5',
  Avalanche: '#E84142',
  AvalancheTestnet: '#E84142',
  Fantom: '#4DACDD',
  BSCTestnet: '#EBBA4E',
  Ethereum: '#627EEA'
} as const

export const NETWORKS_SUBCOLOR_MAP: NETWORKS_COLOR_MAP_TYPE = {
  Polygon: '#8247E50F',
  Avalanche: '#E841420F',
  AvalancheTestnet: '#E841420F',
  Fantom: '#4DACDD0F',
  BSCTestnet: '#F3BA2F0F',
  Ethereum: '#607AE30F'
} as const

export const supportedChainIds = import.meta.env.VITE_SUPPORTED_CHAIN_ID?.split(',').map(id =>
  Number(id)
) ?? [43114]

/**
 * Current supported networks
 */
export const supportedNetworks: ChainNetworkType[] = allNetworks.filter(network =>
  supportedChainIds.includes(network.chainId)
)

export const infuraKey = '65b449dc78314fe583ece8797faccc0a'

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
