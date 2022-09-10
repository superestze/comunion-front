import avalanche from '@/assets/networks/avalanche.svg'
import binance from '@/assets/networks/binance.svg'
import ethereum from '@/assets/networks/ethereum.svg'
import fantom from '@/assets/networks/fantom.svg'
import polygon from '@/assets/networks/polygon.svg'
/**
 * https://chainlist.org/
 */

export type ChainNetworkType = {
  logo: string
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
    chainId: 1,
    name: 'Ethereum',
    shortName: 'Ethereum',
    currencySymbol: 'ETH',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    explorerUrl: 'https://etherscan.io'
  },
  {
    logo: ethereum,
    chainId: 5,
    name: 'Goerli Testnet',
    shortName: 'Goerli Testnet',
    currencySymbol: 'ETH',
    rpcUrl: 'https://goerli.infura.io/v3/',
    explorerUrl: 'https://goerli.etherscan.io'
  },
  {
    logo: avalanche,
    chainId: 43114,
    name: 'Avalanche C-Chain',
    shortName: 'Avalanche',
    currencySymbol: 'AVAX',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorerUrl: 'https://snowtrace.io'
  },
  {
    logo: avalanche,
    chainId: 43113,
    name: 'Avalanche Fuji Testnet',
    shortName: 'Avalanche Testnet',
    currencySymbol: 'AVAX',
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    explorerUrl: 'https://cchain.explorer.avax-test.network'
  },
  {
    logo: fantom,
    chainId: 250,
    name: 'Fantom Opera',
    shortName: 'Fantom',
    currencySymbol: 'FTM',
    rpcUrl: 'https://rpc.ftm.tools',
    explorerUrl: 'https://ftmscan.com'
  },
  {
    logo: fantom,
    chainId: 4002,
    name: 'Fantom Testnet',
    shortName: 'Fantom',
    currencySymbol: 'FTM',
    rpcUrl: 'https://rpc.testnet.fantom.network',
    explorerUrl: 'https://testnet.ftmscan.com'
  },
  {
    logo: binance,
    chainId: 56,
    name: 'Binance Smart Chain Mainnet',
    shortName: 'BSC',
    currencySymbol: 'BNB',
    rpcUrl: 'https://bsc-dataseed1.binance.org',
    explorerUrl: 'https://bscscan.com'
  },
  {
    logo: binance,
    chainId: 97,
    name: 'Binance Smart Chain Testnet',
    shortName: 'BSC Testnet',
    currencySymbol: 'tBNB',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    explorerUrl: 'https://testnet.bscscan.com'
  },
  {
    logo: polygon,
    chainId: 137,
    name: 'Polygon Mainnet',
    shortName: 'Polygon',
    currencySymbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com'
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
