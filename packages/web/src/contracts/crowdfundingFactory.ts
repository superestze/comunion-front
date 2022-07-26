import { Contract, BigNumber } from 'ethers'
import { computed } from 'vue'
import { getContract, GetContractArgs, wrapTransaction } from './share'
import { useWalletStore } from '@/stores'

export const CrowdfundingFactoryAddresses: Record<number, string> = {
  43113: '0xDeFf08A806c9d481C1a1Bc67Ec97c4F10098b108'
}

const abi =
  '[{"inputs":[{"internalType":"address","name":"_sellToken","type":"address"},{"internalType":"address","name":"_buyToken","type":"address"},{"internalType":"uint256","name":"_raiseTotal","type":"uint256"},{"internalType":"uint256","name":"_buyPrice","type":"uint256"},{"internalType":"uint16","name":"_swapPercent","type":"uint16"},{"internalType":"uint16","name":"_sellTax","type":"uint16"},{"internalType":"uint256","name":"_maxBuyAmount","type":"uint256"},{"internalType":"uint16","name":"_maxSellPercent","type":"uint16"},{"internalType":"address","name":"_teamWallet","type":"address"}],"name":"createCrowdfundingContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getDeployedCrowdfundingContracts","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]'

export function useCrowdfundingFactoryContract(): {
  getContract: () => Contract
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
    pendingText: string,
    waitingText: string
  ) => Promise<[]>
  getDeployedCrowdfundingContracts: (
    pendingText: string,
    waitingText: string
  ) => Promise<[/**  */ any]>
  owner: (pendingText: string, waitingText: string) => Promise<[/**  */ string]>
  renounceOwnership: (pendingText: string, waitingText: string) => Promise<[]>
  transferOwnership: (newOwner: string, pendingText: string, waitingText: string) => Promise<[]>
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
    getContract: () => getContract(getContractArgs.value),
    createCrowdfundingContract: wrapTransaction(
      getContractArgs.value,
      'createCrowdfundingContract'
    ),
    getDeployedCrowdfundingContracts: wrapTransaction(
      getContractArgs.value,
      'getDeployedCrowdfundingContracts'
    ),
    owner: wrapTransaction(getContractArgs.value, 'owner'),
    renounceOwnership: wrapTransaction(getContractArgs.value, 'renounceOwnership'),
    transferOwnership: wrapTransaction(getContractArgs.value, 'transferOwnership')
  }
}
