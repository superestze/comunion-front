import { message } from '@comunion/components'
import { Contract } from 'ethers'
import { useContractStore } from '@/stores/contract'
import AbstractWallet from '@/wallets/AbstractWallet'

export function wrapTransaction(
  contractArgs: GetContractArgs,
  functionName: string
): () => Promise<any> {
  const contractStore = useContractStore()
  return (...fnArgs: any[]) => {
    const waitingText = fnArgs.pop()
    const pengdingText = fnArgs.pop()
    let overrides = []

    if (Object.prototype.toString.call(fnArgs[0]) === '[object Object]') {
      overrides = fnArgs.shift()
    }
    contractStore.startContract(pengdingText)

    const contract = getContract(contractArgs)
    console.log('contract===>', contract)

    const fn = contract[functionName]

    return fn(...fnArgs, overrides)
      .then((res: any) => {
        contractStore.endContract('success', {
          success: true,
          hash: res.hash,
          text: waitingText,
          promiseFn: res.wait
        })
        return res
      })
      .catch((e: any) => {
        console.error(e)
        contractStore.endContract('failed', { success: false })
        if (e.data?.message) {
          message.error(e.data.message)
        }
        throw e
      })
  }
}

export type GetContractArgs = {
  addresses: Record<number, string>
  abi: string
  wallet?: AbstractWallet
  chainId?: number
}
export function getContract(args: GetContractArgs) {
  const signer = args.wallet?.getSigner()
  if (!signer) {
    throw new Error('Wallet is not initialized')
  }
  if (!args.chainId) {
    throw new Error('No network selected')
  }
  const address = args.addresses[args.chainId]

  if (!address) {
    throw new Error('Not supported network')
  }
  return new Contract(address, args.abi, signer)
}
