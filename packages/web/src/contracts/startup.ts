import { Contract } from 'ethers'
import { useWallet } from '@/providers'

const address = '0xd9145CCE52D386f254917e481eB44e9943F39138'
const abi =
  '[{"inputs":[{"internalType":"string","name":"id","type":"string"}],"name":"getStartup","outputs":[{"components":[{"internalType":"string","name":"id","type":"string"},{"internalType":"string","name":"name","type":"string"},{"internalType":"enum Startup.Mode","name":"mode","type":"uint8"},{"internalType":"string","name":"hashtag","type":"string"},{"internalType":"bytes","name":"logo","type":"bytes"},{"internalType":"string","name":"mission","type":"string"},{"internalType":"string","name":"overview","type":"string"}],"internalType":"struct Startup.Profile","name":"p","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"string","name":"id","type":"string"},{"internalType":"string","name":"name","type":"string"},{"internalType":"enum Startup.Mode","name":"mode","type":"uint8"},{"internalType":"string","name":"hashtag","type":"string"},{"internalType":"bytes","name":"logo","type":"bytes"},{"internalType":"string","name":"mission","type":"string"},{"internalType":"string","name":"overview","type":"string"}],"internalType":"struct Startup.Profile","name":"p","type":"tuple"}],"name":"newStartup","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address payable","name":"receiver","type":"address"}],"name":"suicide0","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]'

let _contract: Contract = null

export function useStartupContract(): {
  contract: Contract
  getStartup: (
    id: string
  ) => Promise<
    [
      /** p */ [
        /** id */ string,
        /** name */ string,
        /** mode */ number,
        /** hashtag */ string,
        /** logo */ string,
        /** mission */ string,
        /** overview */ string
      ]
    ]
  >
  newStartup: (
    p: [
      id: string,
      name: string,
      mode: number,
      hashtag: string,
      logo: string,
      mission: string,
      overview: string
    ]
  ) => Promise<[]>
  suicide0: (receiver: string) => Promise<[]>
  transferOwnership: (newOwner: string) => Promise<[]>
} {
  const { getWallet } = useWallet()
  const provider = getWallet()?.getProvider()
  if (!provider) {
    throw new Error('Wallet is not initialized')
  }
  if (!_contract) {
    _contract = new Contract(address, abi, provider)
  }
  return {
    contract: _contract,
    getStartup: _contract.getStartup,
    newStartup: _contract.newStartup,
    suicide0: _contract.suicide0,
    transferOwnership: _contract.transferOwnership
  }
}
