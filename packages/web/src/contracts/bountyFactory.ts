import { Contract, BigNumber } from 'ethers'
import { computed } from 'vue'
import { getContract, GetContractArgs, wrapTransaction } from './share'
import { useWalletStore, useChainStore, abiType } from '@/stores'
// export const BountyFactoryAddresses: Record<number, string> = {
//   43113: '0x8B4Dbcc4480926577eC05FCfd1568bFf10F4288e',
//   43114: '0xd8461714Ab1C2E051073520E6c8db8eE15f6147C'
// }

// const abi =
//   '[{"inputs":[{"internalType":"address","name":"_depositToken","type":"address"},{"internalType":"uint256","name":"_founderDepositAmount","type":"uint256"},{"internalType":"uint256","name":"_applicantDepositAmount","type":"uint256"},{"internalType":"uint256","name":"_applyDeadline","type":"uint256"}],"name":"createBounty","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getDeployedBounties","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]'
export const BountyFactoryAddresses = () => {
  const walletStore = useWalletStore()
  const chainStore = useChainStore()
  const addres = (chainStore.abiInfo as abiType)[walletStore.chainId!]?.bounty?.address || ''
  return addres
}
export const getBountyAddresses = () => {
  const walletStore = useWalletStore()
  const chainStore = useChainStore()
  const address = (chainStore.abiInfo as abiType)[walletStore.chainId!]?.bounty?.address || ''
  return {
    [walletStore.chainId!]: address
  }
}
export function useBountyFactoryContract(
  params: Omit<GetContractArgs, 'abi'> = { addresses: getBountyAddresses() }
): {
  getContract: () => Contract
  createBounty: (
    _depositToken: string,
    _founderDepositAmount: number | BigNumber,
    _applicantDepositAmount: number | BigNumber,
    _applyDeadline: number | BigNumber,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  getDeployedBounties: (
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
  const chainStore = useChainStore()
  const abi = (chainStore.abiInfo as abiType)[walletStore.chainId!]?.bounty?.abi
  const BountyFactoryAddresses = {
    [walletStore.chainId!]:
      (chainStore.abiInfo as abiType)[walletStore.chainId!]?.bounty?.address || ''
  }
  const getContractArgs = computed<GetContractArgs>(() => {
    return {
      abi,
      addresses: BountyFactoryAddresses,
      wallet: walletStore.wallet,
      chainId: walletStore.chainId
    }
  })
  return {
    getContract: () => getContract({ ...getContractArgs.value, ...params }),
    createBounty: wrapTransaction({ ...getContractArgs.value, ...params }, 'createBounty'),
    getDeployedBounties: wrapTransaction({ ...getContractArgs.value, ...params }, 'children'),
    owner: wrapTransaction({ ...getContractArgs.value, ...params }, 'owner'),
    renounceOwnership: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'renounceOwnership'
    ),
    transferOwnership: wrapTransaction({ ...getContractArgs.value, ...params }, 'transferOwnership')
  }
}
