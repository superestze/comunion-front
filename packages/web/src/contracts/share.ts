import { ContractTransaction } from 'ethers'
import { useContractStore } from '@/stores/contract'

export function wrapTransaction(
  fn: (...args: any) => Promise<ContractTransaction>
): (...args: any) => Promise<any> {
  const contractStore = useContractStore()
  return (...args: any[]) => {
    const waitingText = args.pop()
    const pengdingText = args.pop()
    contractStore.startContract(pengdingText)
    return fn(...args)
      .then(res => {
        contractStore.endContract('success', {
          success: true,
          hash: res.hash,
          text: waitingText,
          promiseFn: res.wait
        })
      })
      .catch(e => {
        console.error(e)
        contractStore.endContract('failed', { success: false })
        throw e
      })
  }
}
