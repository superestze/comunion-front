import type {
  UContractInteractionPropsType,
  UContractInteractionStatus
} from '@comunion/components'

import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { services } from '@/services'
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
export type optionsType = {
  nextwork: number
  switch: boolean
  name: string
  type: number
  mission: string
  overview: string
  tags: Array<string>
  setting?: boolean
}
export type optionsSettingType = optionsType & {
  startupId: string
  logo: string
  cover: string
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
        | { success: true; hash: string; text: string; promiseFn: () => Promise<any> },
      options: optionsSettingType = {
        nextwork: -1,
        switch: false,
        name: '',
        type: -1,
        mission: '',
        overview: '',
        tags: [],
        startupId: '',
        logo: '',
        cover: ''
      }
    ) {
      this.contract.status = status as UContractInteractionStatus
      if (ret.success) {
        if (options.name) {
          if (options?.setting) {
            this.setStartupSuccessAfter({ ...options, ...{ txHash: ret.hash } })
          } else {
            this.createStartupSuccessAfter({ ...options, ...{ txHash: ret.hash } })
          }
        }
        const transaction: ContractState['transacations'][number] = reactive({
          hash: ret.hash,
          text: ret.text,
          status: 'pending'
        })
        this.transacations.push(transaction)
        try {
          await ret.promiseFn()
          console.log(`tx ${ret.hash} success`)
          transaction.status = 'success'
          return true
        } catch (error) {
          transaction.status = 'failed'
          return false
        }
      }
      return false
    },
    closeTransaction(transaction: TransacationType) {
      const index = this.transacations.indexOf(transaction)
      if (index > -1) {
        this.transacations.splice(index, 1)
      }
    },
    async createStartupSuccessAfter(options: optionsType & { txHash: string }) {
      try {
        const res = await services['startup@startup-create']({
          mode: options.type,
          name: options.name,
          mission: options.mission,
          overview: options.overview,
          txHash: options.txHash,
          chainId: options.nextwork,
          hashTags: options.tags
        })
        return res
      } catch (error) {
        console.error(error)
        return {
          data: null
        }
      }
    },
    async setStartupSuccessAfter(options: optionsSettingType & { txHash: string }) {
      try {
        const { data } = await services['startup@startup-basic-setting-update-new']({
          startupId: options.startupId,
          mode: options.type,
          name: options.name,
          mission: options.mission,
          overview: options.overview,
          txHash: options.txHash,
          chainId: options.nextwork,
          hashTags: options.tags,
          logo: options.logo,
          cover: options.cover
        })
        return { data }
      } catch (error) {
        console.error(error)
        return {
          data: null
        }
      }
    }
  }
})
