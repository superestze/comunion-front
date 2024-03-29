import { message } from '@comunion/components'
import dayjs from 'dayjs'
import { BigNumber } from 'ethers'
import { computed } from 'vue'
import { useRequest } from 'vue-request'
import useBountyDetail from './useBountyDetail'
import { useBountyContract, useErc20Contract } from '@/contracts'
import { AVAX_USDC_ADDR } from '@/contracts/utils'
import { useWalletStore, useUserStore } from '@/stores'
import { useBountyContractStore } from '@/stores/bountyContract'
export type BountyContractReturnType = {
  hash: string
  type: number
  accessList: null
  blockHash: null
  blockNumber: null
  transactionIndex: null
  confirmations: number
  from: string
  gasPrice: {
    type: 'BigNumber'
    hex: '0x081d38cc80'
  }
  maxPriorityFeePerGas: {
    type: 'BigNumber'
    hex: '0x0121152080'
  }
  maxFeePerGas: {
    type: 'BigNumber'
    hex: '0x081d38cc80'
  }
  gasLimit: {
    type: 'BigNumber'
    hex: '0xfb4f'
  }
  to: string
  value: {
    type: 'BigNumber'
    hex: '0x00'
  }
  nonce: number
  data: string
  r: string
  s: string
  v: number
  creates: null
  chainId: number
}
type useBountyContractWrapperType = {
  bountyContract: any
  usdc: any
  approve: any
  gap: any
  bountyContractStore: any
  chainId: number | undefined
}
let cancel: () => void
export function useBountyContractWrapper(bountyId?: string): useBountyContractWrapperType {
  const walletStore = useWalletStore()
  const userStore = useUserStore()
  const { detail } = useBountyDetail(bountyId)
  const bountyContractStore = useBountyContractStore()
  const bountyContract = useBountyContract({
    chainId: walletStore.chainId,
    addresses: { [walletStore.chainId!]: detail.value?.depositContract || '' }
  })

  if (bountyId) {
    // when user is logout, stop request
    if (!userStore.profile && cancel) {
      cancel()
    } else {
      if (cancel) {
        cancel()
      }
      const res = useRequest(bountyContractStore.initialize, {
        defaultParams: [bountyContract, bountyId as string],
        pollingInterval: 5000,
        pollingWhenHidden: true
      })
      cancel = res.cancel
    }
  }
  const usdcTokenContract = useErc20Contract()
  const usdc = usdcTokenContract(AVAX_USDC_ADDR[walletStore.chainId!])

  const approve = async (contractAddress: string, amount: BigNumber) => {
    // const usdcRes = await usdc.approve(contractAddress, amount)
    return usdc
      .approve(contractAddress, amount)
      .then((usdcRes: any) => {
        return usdcRes.wait().catch((err: any) => {
          console.warn(`usdcRes err:`, err)
        })
      })
      .catch((err: any) => {
        switch (err.code) {
          case 4001:
            message.error('Authorization failed')
            break
          case -32603:
            message.error('MetaMask network connection failed')
            break
          default:
            console.warn(`usdc.approve err with params:${contractAddress}, ${amount}`, err)
        }
      })
  }
  const gap = computed(() => {
    return dayjs(new Date(bountyContractStore.bountyContractInfo.timeLock * 1000)).diff(
      dayjs(new Date()),
      'day'
    )
  })

  return {
    bountyContract,
    usdc,
    approve,
    gap,
    bountyContractStore,
    chainId: walletStore.chainId
  }
}
