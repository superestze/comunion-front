import { Contract, BigNumber } from 'ethers'
import { computed } from 'vue'
import { getContract, GetContractArgs, wrapTransaction } from './share'
import { useWalletStore } from '@/stores'

export const StartupAddresses: Record<number, string> = {
  5: '0x744E0A1452F5E3Dc42E75c4C4B4de9faa16E3948',
  43113: '0xC31a16498d1B8d703883B509097f099165D5324A',
  97: '0xd8461714Ab1C2E051073520E6c8db8eE15f6147C',
  4002: '0xc7a1bAe0Db6203F3Ee3C721909B3b959a1b437Ca',
  80001: '0xc7a1bAe0Db6203F3Ee3C721909B3b959a1b437Ca',
  5700: '0xc7a1bAe0Db6203F3Ee3C721909B3b959a1b437Ca',
  2814: '0xd8461714Ab1C2E051073520E6c8db8eE15f6147C'
}

const abi =
  '[{"inputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"bool","name":"used","type":"bool"}],"internalType":"struct Startup.Profile","name":"p","type":"tuple"}],"name":"createStartup","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"}],"name":"getStartup","outputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"bool","name":"used","type":"bool"}],"internalType":"struct Startup.Profile","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]'

export function useStartupContract(
  params: Omit<GetContractArgs, 'abi'> = { addresses: StartupAddresses }
): {
  getContract: () => Contract
  createStartup: (
    p: [name: string, chainId: number | BigNumber, used: any],
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  getStartup: (
    name: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ [/** name */ string, /** chainId */ number | BigNumber, /** used */ any]]>
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
      addresses: StartupAddresses,
      wallet: walletStore.wallet,
      chainId: walletStore.chainId
    }
  })
  return {
    getContract: () => getContract({ ...getContractArgs.value, ...params }),
    createStartup: wrapTransaction({ ...getContractArgs.value, ...params }, 'createStartup'),
    getStartup: wrapTransaction({ ...getContractArgs.value, ...params }, 'getStartup'),
    owner: wrapTransaction({ ...getContractArgs.value, ...params }, 'owner'),
    renounceOwnership: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'renounceOwnership'
    ),
    transferOwnership: wrapTransaction({ ...getContractArgs.value, ...params }, 'transferOwnership')
  }
}
