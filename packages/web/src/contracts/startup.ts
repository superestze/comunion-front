import { Contract } from 'ethers'
import { computed } from 'vue'
import { getContract, GetContractArgs, wrapTransaction } from './share'
import { useWalletStore } from '@/stores'

const addresses: Record<number, string> = {
  5: '0xEdf4565af54D9508e247c044F09EddcaD91DAdED',
  43113: '0x7E94572BCc67B6eDa93DBa0493b681dC0ae9E964',
  43114: '0x45BE0Eaa7076854d790A9583c6E3AE020d1A1556'
}

const abi =
  '[{"inputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"enum Startup.Mode","name":"mode","type":"uint8"},{"internalType":"string","name":"logo","type":"string"},{"internalType":"string","name":"mission","type":"string"},{"internalType":"string","name":"overview","type":"string"},{"internalType":"bool","name":"isValidate","type":"bool"}],"internalType":"struct Startup.Profile","name":"p","type":"tuple"}],"name":"newStartup","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"startups","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"enum Startup.Mode","name":"mode","type":"uint8"},{"internalType":"string","name":"logo","type":"string"},{"internalType":"string","name":"mission","type":"string"},{"internalType":"string","name":"overview","type":"string"},{"internalType":"bool","name":"isValidate","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address payable","name":"receiver","type":"address"}],"name":"suicide0","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]'

export function useStartupContract(): {
  getContract: () => Contract
  newStartup: (
    p: [
      name: string,
      mode: number,
      logo: string,
      mission: string,
      overview: string,
      isValidate: any
    ],
    pendingText: string,
    waitingText: string
  ) => Promise<[]>
  startups: (
    arg0: string,
    pendingText: string,
    waitingText: string
  ) => Promise<
    [
      /** name */ string,
      /** mode */ number,
      /** logo */ string,
      /** mission */ string,
      /** overview */ string,
      /** isValidate */ any
    ]
  >
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
    newStartup: wrapTransaction(getContractArgs.value, 'newStartup'),
    startups: wrapTransaction(getContractArgs.value, 'startups'),
    suicide0: wrapTransaction(getContractArgs.value, 'suicide0'),
    transferOwnership: wrapTransaction(getContractArgs.value, 'transferOwnership')
  }
}
