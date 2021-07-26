import { useEther } from '@/hooks/useEther'
import { Contract } from 'ethers'
import { watch } from 'vue'
import ABI from './abi.json?raw'

export const <%= titleUpper %>_CONTRACT_ADDRESS = '<%= address %>'

export interface <%= titleHead %>ContractFunctions {
  fullset: (arg1: number, arg2: string) => Promise<any>
}

export function use<%= titleHead %>Contract() {
  const { currentProvider } = useEther()
  let contract: Contract
  watch(currentProvider.value, v => {
    if (v) {
      contract = new Contract(<%= titleUpper %>_CONTRACT_ADDRESS, ABI, v)
    }
  })
  return contract.functions as unknown as <%= titleHead %>ContractFunctions
}
