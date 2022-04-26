import type {
  UContractInteractionPropsType,
  UContractInteractionStatus
} from '@comunion/components'

import { defineStore } from 'pinia'
import { DeepWriteable } from '@/utils/type'

export type TransacationType = {
  hash: string
  text: string
  status: 'pending' | 'success' | 'failed'
}

export type ContractState = {
  // current status
  contract: DeepWriteable<NonNullable<UContractInteractionPropsType>>
  // pending contract transacations
  transacations: TransacationType[]
}

export const useContractStore = defineStore('contract', {
  state: (): ContractState => ({
    contract: {
      status: undefined,
      text: ''
    },
    transacations: []
  }),
  actions: {
    startContract(text: string) {
      this.contract.status = 'pending'
      this.contract.text = text
    },
    async endContract(
      status: Omit<UContractInteractionStatus, 'pending'>,
      ret:
        | {
            success: false
          }
        | { success: true; hash: string; text: string; promiseFn: () => Promise<any> }
    ) {
      this.contract.status = status as UContractInteractionStatus
      if (ret.success) {
        const transaction: ContractState['transacations'][number] = {
          hash: ret.hash,
          text: ret.text,
          status: 'pending'
        }
        this.transacations.push(transaction)
        try {
          await ret.promiseFn()
          transaction.status = 'success'
        } catch (error) {
          transaction.status = 'failed'
        }
      }
    },
    closeTransaction(transaction: TransacationType) {
      const index = this.transacations.indexOf(transaction)
      if (index > -1) {
        this.transacations.splice(index, 1)
      }
    }
  }
})
