import { useWallet } from '@/providers'
import { Contract } from 'ethers'

const address = 'xxxxxxxxxxxxxxx'
const abi =
  '[{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"adopters","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"petId","type":"uint256"}],"name":"adopt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAdopters","outputs":[{"internalType":"address[16]","name":"","type":"address[16]"}],"stateMutability":"view","type":"function","constant":true}]'

let _contract: Contract = null

export function useStartupContract(): {
  contract: Contract
  adopters: (arg0: number) => Promise<[string]>
  adopt: (petId: number) => Promise<[number]>
  getAdopters: () => Promise<[any]>
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
    adopters: _contract.adopters,
    adopt: _contract.adopt,
    getAdopters: _contract.getAdopters
  }
}
