import { useTransactionStore } from '@/stores/transaction'

export function wrapTransaction(
  fn: (...args: any) => Promise<any>
): (...args: any) => Promise<any> {
  const transactionStore = useTransactionStore()
  return (...args: any[]) => {
    const _args = args.slice(0, args.length - 1)
    const text = args[args.length - 1]
    transactionStore.startTransaction(text)
    return fn(..._args)
      .then(() => {
        transactionStore.endTransaction('success')
      })
      .catch(e => {
        console.error(e)
        transactionStore.endTransaction('failed')
        throw e
      })
  }
}
