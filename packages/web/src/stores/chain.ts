import { defineStore } from 'pinia'
import { allNetworks } from '@/constants'
import { services } from '@/services'

export type ChainNetworkType = {
  logo: string
  chainId: number
  name: string
  shortName?: string
  currencySymbol: string
  rpcUrl: string
  explorerUrl: string
}
export const useChainStore = defineStore('chain', {
  state: () => ({
    allNetworks,
    supportedNetworks: [
      {
        logo: '',
        chainId: 1,
        name: '',
        currencySymbol: '',
        rpcUrl: '',
        explorerUrl: ''
      }
    ]
  }),
  getters: {},
  actions: {
    async init() {
      try {
        const { data } = await services['account@chain-list']({})
        const supportNet: Array<ChainNetworkType> = []
        data?.list.map((item: any) => {
          this.allNetworks.map(sn => {
            if (Number(item.chain_id) === Number(sn.chainId)) {
              const obj = { ...item, ...sn }
              supportNet.push(obj)
            }
          })
        })
        this.supportedNetworks = supportNet
        console.log(this.supportedNetworks)
      } catch (error) {
        console.warn(error)
      }
    }
  }
})
