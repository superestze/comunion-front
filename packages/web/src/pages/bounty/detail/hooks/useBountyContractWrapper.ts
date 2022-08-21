import dayjs from 'dayjs'
import { BigNumber } from 'ethers'
import { computed } from 'vue'
import { useBountyContract, useErc20Contract } from '@/contracts'
import { AVAX_USDC_ADDR } from '@/contracts/utils'
import { useWalletStore } from '@/stores'
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

export function useBountyContractWrapper() {
  const walletStore = useWalletStore()
  const bountyContractStore = useBountyContractStore()
  const bountyContract = useBountyContract({
    chainId: walletStore.chainId,
    addresses: { [walletStore.chainId!]: '0x11FF42b0cBAC4E5DE2bC0C9B973F40790a40A17a' }
  })

  const usdcTokenContract = useErc20Contract()
  const usdc = usdcTokenContract(AVAX_USDC_ADDR[43113])

  const approve = async (contractAddress: string, amount: BigNumber) => {
    const usdcRes = await usdc.approve(contractAddress, amount)
    await usdcRes.wait()
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
    chainId: 43113
  }
}
