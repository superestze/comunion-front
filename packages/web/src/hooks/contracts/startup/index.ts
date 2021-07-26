import { useEther } from '@/hooks/useEther'
import { Contract } from 'ethers'
import { watch } from 'vue'
import ABI from './abi.json?raw'

export const STARTUP_CONTRACT_ADDRESS = '0xaskjdfnasjkdfas'

export interface StartupContractFunctions {
  fullset: (arg1: number, arg2: string) => Promise<any>
}

export function useStartupContract() {
  const { currentProvider } = useEther()
  let contract: Contract
  watch(currentProvider.value, v => {
    if (v) {
      contract = new Contract(STARTUP_CONTRACT_ADDRESS, ABI, v)
    }
  })
  return contract.functions as unknown as StartupContractFunctions
}
