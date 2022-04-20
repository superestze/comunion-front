import type { UTransactionPropsType, UTransactionStatus } from '@comunion/components'

import { defineStore } from 'pinia'
import { DeepWriteable } from '@/utils/type'

export type TransactionState = {
  // transaction status
  transaction: DeepWriteable<NonNullable<UTransactionPropsType>>
  // TODO pending transactions
  transactions: any[]
}

export const useTransactionStore = defineStore('transaction', {
  state: (): TransactionState => ({
    transaction: {
      status: undefined,
      text: ''
    },
    transactions: []
  }),
  actions: {
    startTransaction(text: string) {
      this.transaction.status = 'pending'
      this.transaction.text = text
    },
    endTransaction(status: Omit<UTransactionStatus, 'pending'>, transactionId?: string) {
      this.transaction.status = status as UTransactionStatus
      if (transactionId) {
        // FIXME
        this.transactions.push({
          id: transactionId,
          text: this.transaction.text
        })
      }
    }
  }
})
