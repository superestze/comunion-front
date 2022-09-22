import { message } from '@comunion/components'
import dayjs from 'dayjs'
import { BigNumber } from 'ethers'
import { computed } from 'vue'
import { useBountyContract, useErc20Contract } from '@/contracts'
import { AVAX_USDC_ADDR } from '@/contracts/utils'
import { useBountyStore, useWalletStore } from '@/stores'
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

export function useBountyContractWrapper(bountyId?: string) {
  const walletStore = useWalletStore()
  const bountyStore = useBountyStore()
  const bountyContractStore = useBountyContractStore()
  const bountyContract = useBountyContract({
    chainId: walletStore.chainId,
    addresses: { [walletStore.chainId!]: bountyStore.bountySection?.detail?.depositContract || '' }
  })

  if (bountyId) {
    bountyContractStore.initialize(bountyContract, bountyId as string, true)
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
            message.error('授权失败')
            break
          case -32603:
            message.error('MetaMask 网络连接失败')
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
