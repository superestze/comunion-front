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
  label: string
  value: number
}

/**
 * All networks we want to support
 */
export const allNetworks: ChainNetworkType[] = [
  {
    logo: ethereum,
    chainId: 1,
    value: 1,
    label: 'Ethereum',
    name: 'Ethereum',
    currencySymbol: 'ETH',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    explorerUrl: 'https://etherscan.io'
  },
  {
    logo: ethereum,
    chainId: 5,
    value: 5,
    label: 'Goerli Testnet',
    name: 'Goerli Testnet',
    currencySymbol: 'ETH',
    rpcUrl: 'https://goerli.infura.io/v3/',
    explorerUrl: 'https://goerli.etherscan.io'
  },
  {
    logo: avalanche,
    chainId: 43114,
    value: 43114,
    label: 'Avalanche C-Chain',
    name: 'Avalanche C-Chain',
    shortName: 'Avalanche',
    currencySymbol: 'AVAX',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorerUrl: 'https://snowtrace.io'
  },
  {
    logo: avalanche,
    chainId: 43113,
    value: 43113,
    label: 'Avalanche Fuji Testnet',
    name: 'Avalanche Fuji Testnet',
    shortName: 'Avalanche Testnet',
    currencySymbol: 'AVAX',
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    explorerUrl: 'https://cchain.explorer.avax-test.network'
  },
  {
    logo: fantom,
    chainId: 250,
    value: 250,
    label: 'Fantom Opera',
    name: 'Fantom Opera',
    shortName: 'Fantom',
    currencySymbol: 'FTM',
    rpcUrl: 'https://rpc.ftm.tools',
    explorerUrl: 'https://ftmscan.com'
  },
  {
    logo: fantom,
    chainId: 4002,
    value: 4002,
    label: 'Fantom Testnet',
    name: 'Fantom Testnet',
    currencySymbol: 'FTM',
    rpcUrl: 'https://rpc.testnet.fantom.network',
    explorerUrl: 'https://testnet.ftmscan.com'
  },
  {
    logo: binance,
    chainId: 56,
    value: 56,
    label: 'Binance Smart Chain Mainnet',
    name: 'Binance Smart Chain Mainnet',
    shortName: 'BSC',
    currencySymbol: 'BNB',
    rpcUrl: 'https://bsc-dataseed1.binance.org',
    explorerUrl: 'https://bscscan.com'
  },
  {
    logo: binance,
    chainId: 97,
    value: 97,
    label: 'Binance Smart Chain Testnet',
    name: 'Binance Smart Chain Testnet',
    shortName: 'BSC Testnet',
    currencySymbol: 'tBNB',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    explorerUrl: 'https://testnet.bscscan.com'
  },
  {
    logo: polygon,
    chainId: 137,
    value: 137,
    label: 'Polygon Mainnet',
    name: 'Polygon Mainnet',
    shortName: 'Polygon',
    currencySymbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com'
  }
]

export const supportedChainIds = import.meta.env.VITE_SUPPORTED_CHAIN_ID?.split(',').map(id =>
  Number(id)
) ?? [43114]

/**
 * Current supported networks
 */
export const supportedNetworks: ChainNetworkType[] = allNetworks.filter(network =>
  supportedChainIds.includes(network.chainId)
)
