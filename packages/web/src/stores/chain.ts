import { defineStore } from 'pinia'
import { allNetworks } from '@/constants'
import type { ChainNetworkType } from '@/constants'
import { services } from '@/services'
export type abiType = {
  [prop: number]: {
    startup: {
      abi: string
      address: string
    }
    bounty: {
      abi: string
      address: string
    }
    crowdfunding: {
      abi: string
      address: string
    }
  }
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
    ],
    abiInfo: {}
  }),
  getters: {
    getSupportedNetworks: state => state.supportedNetworks
  },
  actions: {
    async init() {
      try {
        const { data } = await services['chain@chain-list']({})
        const supportNet: Array<ChainNetworkType> = []
        console.log(data)
        data?.list?.map((item: any) => {
          this.allNetworks.map(sn => {
            if (Number(item.chain_id) === Number(sn.chainId)) {
              const obj = { ...item, ...sn }
              supportNet.push(obj)
            }
          })
        })
        // abi
        supportNet.forEach(snet => {
          const obj = {
            startup: {
              abi: '',
              address: ''
            },
            bounty: {
              abi: '',
              address: ''
            },
            crowdfunding: {
              abi: '',
              address: ''
            }
          }
          snet.chain_contracts?.forEach(chain => {
            switch (chain.project) {
              case 1:
                obj.startup.abi = chain.abi
                obj.startup.address = chain.address
                break
              case 2:
                obj.bounty.abi = chain.abi
                obj.bounty.address = chain.address
                break
              case 3:
                obj.crowdfunding.abi = chain.abi
                obj.crowdfunding.address = chain.address
                break
              default:
                break
            }
          })
          ;(this.abiInfo as abiType)[snet.chainId] = obj
        })
        this.supportedNetworks = supportNet
        // setTimeout(() => {
        //   this.supportedNetworks = supportNet
        // }, 2000)
      } catch (error) {
        console.warn(error)
      }
    }
  }
})
