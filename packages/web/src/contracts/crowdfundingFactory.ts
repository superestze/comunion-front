import { Contract, BigNumber } from 'ethers'
import { computed } from 'vue'
import { getContract, GetContractArgs, wrapTransaction } from './share'
import { useWalletStore } from '@/stores'

export const CrowdfundingFactoryAddresses: Record<number, string> = {
  5: '0x25bEd75F960fF14ed7EA36283dCFFa76931752CF',
  43113: '0x40539eB21d1e9E22d41d7E947336F268B63C6952',
  97: '0x6187f53e7AC4cfB95ea1c4E906e777d0d2f6763E',
  4002: '0xFefEab21A1CddBAda7c1077FBc1cC92e07B5ce78',
  80001: '0xFefEab21A1CddBAda7c1077FBc1cC92e07B5ce78',
  2814: '0xB5350F5F6514103Bc0A6CFECE2d644042437C769'
}

const abi =
  '[{"inputs":[],"name":"children","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_sellToken","type":"address"},{"internalType":"address","name":"_buyToken","type":"address"},{"internalType":"uint256","name":"_raiseTotal","type":"uint256"},{"internalType":"uint256","name":"_buyPrice","type":"uint256"},{"internalType":"uint16","name":"_swapPercent","type":"uint16"},{"internalType":"uint16","name":"_sellTax","type":"uint16"},{"internalType":"uint256","name":"_maxBuyAmount","type":"uint256"},{"internalType":"uint16","name":"_maxSellPercent","type":"uint16"},{"internalType":"address","name":"_teamWallet","type":"address"},{"internalType":"uint256","name":"_startTime","type":"uint256"},{"internalType":"uint256","name":"_endTime","type":"uint256"}],"name":"createCrowdfundingContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"isChild","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]'

export function useCrowdfundingFactoryContract(
  params: Omit<GetContractArgs, 'abi'> = { addresses: CrowdfundingFactoryAddresses }
): {
  getContract: () => Contract
  children: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ any]>
  createCrowdfundingContract: (
    _sellToken: string,
    _buyToken: string,
    _raiseTotal: number | BigNumber,
    _buyPrice: number | BigNumber,
    _swapPercent: any,
    _sellTax: any,
    _maxBuyAmount: number | BigNumber,
    _maxSellPercent: any,
    _teamWallet: string,
    _startTime: number | BigNumber,
    _endTime: number | BigNumber,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  isChild: (
    _address: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ any]>
  owner: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ string]>
  renounceOwnership: (pendingText: string, waitingText: string, overrides?: any) => Promise<[]>
  transferOwnership: (
    newOwner: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
} {
  const walletStore = useWalletStore()
  const getContractArgs = computed<GetContractArgs>(() => {
    return {
      abi,
      addresses: CrowdfundingFactoryAddresses,
      wallet: walletStore.wallet,
      chainId: walletStore.chainId
    }
  })
  return {
    getContract: () => getContract({ ...getContractArgs.value, ...params }),
    children: wrapTransaction({ ...getContractArgs.value, ...params }, 'children'),
    createCrowdfundingContract: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'createCrowdfundingContract'
    ),
    isChild: wrapTransaction({ ...getContractArgs.value, ...params }, 'isChild'),
    owner: wrapTransaction({ ...getContractArgs.value, ...params }, 'owner'),
    renounceOwnership: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'renounceOwnership'
    ),
    transferOwnership: wrapTransaction({ ...getContractArgs.value, ...params }, 'transferOwnership')
  }
}
