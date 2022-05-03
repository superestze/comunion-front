import { Contract } from 'ethers'
import { wrapTransaction } from './share'
import { useWalletStore } from '@/stores'

const address = '0x7E94572BCc67B6eDa93DBa0493b681dC0ae9E964'
const abi =
  '[{"inputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"enum Startup.Mode","name":"mode","type":"uint8"},{"internalType":"string","name":"logo","type":"string"},{"internalType":"string","name":"mission","type":"string"},{"internalType":"string","name":"overview","type":"string"},{"internalType":"bool","name":"isValidate","type":"bool"}],"internalType":"struct Startup.Profile","name":"p","type":"tuple"}],"name":"newStartup","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"startups","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"enum Startup.Mode","name":"mode","type":"uint8"},{"internalType":"string","name":"logo","type":"string"},{"internalType":"string","name":"mission","type":"string"},{"internalType":"string","name":"overview","type":"string"},{"internalType":"bool","name":"isValidate","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address payable","name":"receiver","type":"address"}],"name":"suicide0","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]'

let _contract: Contract | null = null

export function useStartupContract(): () => {
  contract: Contract
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
  return () => {
    const signer = walletStore.wallet?.getSigner()
    if (!signer) {
      throw new Error('Wallet is not initialized')
    }
    if (!_contract || address !== _contract.address || signer !== _contract.signer) {
      _contract = new Contract(address, abi, signer)
    }
    return {
      contract: _contract,
      newStartup: wrapTransaction(_contract.newStartup),
      startups: wrapTransaction(_contract.startups),
      suicide0: wrapTransaction(_contract.suicide0),
      transferOwnership: wrapTransaction(_contract.transferOwnership)
    }
  }
}
