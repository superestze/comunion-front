import { Contract, BigNumber } from 'ethers'
import { computed } from 'vue'
import { getContract, GetContractArgs, wrapTransaction } from './share'
import { useWalletStore } from '@/stores'

export const BountyFactoryAddresses: Record<number, string> = {
  5: '0x42583219DC1564D465DDD01D3327CEF942f6aB88',
  43113: '0x18bA7216E088816c2CA7a6Bee08Bec48F4c9e25c',
  97: '0xAAb8FCD8DD22a5de73550F8e67fF9Ca970d1257E',
  4002: '0xd8461714Ab1C2E051073520E6c8db8eE15f6147C',
  80001: '0xd8461714Ab1C2E051073520E6c8db8eE15f6147C',
  2814: '0xAAb8FCD8DD22a5de73550F8e67fF9Ca970d1257E'
}

const abi =
  '[{"inputs":[],"name":"children","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_depositToken","type":"address"},{"internalType":"uint256","name":"_founderDepositAmount","type":"uint256"},{"internalType":"uint256","name":"_applicantDepositAmount","type":"uint256"},{"internalType":"uint256","name":"_applyDeadline","type":"uint256"}],"name":"createBounty","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"isChild","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]'

export function useBountyFactoryContract(
  params: Omit<GetContractArgs, 'abi'> = { addresses: BountyFactoryAddresses }
): {
  getContract: () => Contract
  children: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ any]>
  createBounty: (
    _depositToken: string,
    _founderDepositAmount: number | BigNumber,
    _applicantDepositAmount: number | BigNumber,
    _applyDeadline: number | BigNumber,
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
      addresses: BountyFactoryAddresses,
      wallet: walletStore.wallet,
      chainId: walletStore.chainId
    }
  })
  return {
    getContract: () => getContract({ ...getContractArgs.value, ...params }),
    children: wrapTransaction({ ...getContractArgs.value, ...params }, 'children'),
    createBounty: wrapTransaction({ ...getContractArgs.value, ...params }, 'createBounty'),
    isChild: wrapTransaction({ ...getContractArgs.value, ...params }, 'isChild'),
    owner: wrapTransaction({ ...getContractArgs.value, ...params }, 'owner'),
    renounceOwnership: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'renounceOwnership'
    ),
    transferOwnership: wrapTransaction({ ...getContractArgs.value, ...params }, 'transferOwnership')
  }
}
