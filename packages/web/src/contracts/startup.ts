import { Contract } from 'ethers'
import { useWallet } from '@/providers'

const address = '0x319C25a41Eb9C4B9E84C9b911DaB21995f7b7913'
const abi =
  '[{"inputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"enum Startup.Mode","name":"mode","type":"uint8"},{"internalType":"string[]","name":"hashtag","type":"string[]"},{"internalType":"string","name":"logo","type":"string"},{"internalType":"string","name":"mission","type":"string"},{"internalType":"address","name":"tokenContract","type":"address"},{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"address","name":"walletAddress","type":"address"}],"internalType":"struct Startup.wallet[]","name":"wallets","type":"tuple[]"},{"internalType":"string","name":"overview","type":"string"},{"internalType":"bool","name":"isValidate","type":"bool"}],"internalType":"struct Startup.Profile","name":"p","type":"tuple"}],"name":"newStartup","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"startups","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"enum Startup.Mode","name":"mode","type":"uint8"},{"internalType":"string","name":"logo","type":"string"},{"internalType":"string","name":"mission","type":"string"},{"internalType":"address","name":"tokenContract","type":"address"},{"internalType":"string","name":"overview","type":"string"},{"internalType":"bool","name":"isValidate","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address payable","name":"receiver","type":"address"}],"name":"suicide0","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]'

let _contract: Contract = null

export function useStartupContract(): () => {
  contract: Contract
  newStartup: (
    p: [
      name: string,
      mode: number,
      hashtag: string[],
      logo: string,
      mission: string,
      tokenContract: string,
      wallets: [name: string, walletAddress: string][],
      overview: string,
      isValidate: any
    ]
  ) => Promise<[]>
  startups: (
    arg0: string
  ) => Promise<
    [
      /** name */ string,
      /** mode */ number,
      /** logo */ string,
      /** mission */ string,
      /** tokenContract */ string,
      /** overview */ string,
      /** isValidate */ any
    ]
  >
  suicide0: (receiver: string) => Promise<[]>
  transferOwnership: (newOwner: string) => Promise<[]>
} {
  const { getWallet } = useWallet()
  return () => {
    const signer = getWallet()?.getSigner()
    if (!signer) {
      throw new Error('Wallet is not initialized')
    }
    if (!_contract || address !== _contract.address || signer !== _contract.signer) {
      _contract = new Contract(address, abi, signer)
    }
    return {
      contract: _contract,
      newStartup: _contract.newStartup,
      startups: _contract.startups,
      suicide0: _contract.suicide0,
      transferOwnership: _contract.transferOwnership
    }
  }
}
