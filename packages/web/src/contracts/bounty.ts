import { Contract, BigNumber } from 'ethers'
import { computed } from 'vue'
import { getContract, GetContractArgs, wrapTransaction } from './share'
import { useWalletStore } from '@/stores'

export const addresses: Record<number, string> = {
  43113: '0xdBAd77b0994F262Ebf91f87F1A1975B30786Ac0c',
  43114: '0x515651e1c1A55cA468742cB5ea08Ca7c030d928a'
}

const abi =
  '[{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"createBounty","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"},{"internalType":"address payable","name":"oriSender","type":"address"},{"internalType":"uint256","name":"oriVal","type":"uint256"},{"internalType":"uint256","name":"time","type":"uint256"}],"name":"invest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"receiver","type":"address"}],"name":"suicide0","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]'

export function useBountyContract(): {
  getContract: () => Contract
  createBounty: (
    amount: number | BigNumber,
    pendingText: string,
    waitingText: string
  ) => Promise<[]>
  invest: (
    id: string,
    oriSender: string,
    oriVal: number | BigNumber,
    time: number | BigNumber,
    pendingText: string,
    waitingText: string
  ) => Promise<[]>
  suicide0: (receiver: string, pendingText: string, waitingText: string) => Promise<[]>
  transferOwnership: (newOwner: string, pendingText: string, waitingText: string) => Promise<[]>
} {
  const walletStore = useWalletStore()
  const getContractArgs = computed<GetContractArgs>(() => {
    return {
      abi,
      addresses,
      wallet: walletStore.wallet,
      chainId: walletStore.chainId
    }
  })
  return {
    getContract: () => getContract(getContractArgs.value),
    createBounty: wrapTransaction(getContractArgs.value, 'createBounty'),
    invest: wrapTransaction(getContractArgs.value, 'invest'),
    suicide0: wrapTransaction(getContractArgs.value, 'suicide0'),
    transferOwnership: wrapTransaction(getContractArgs.value, 'transferOwnership')
  }
}
