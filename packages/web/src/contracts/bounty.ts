import { Contract } from 'ethers'
import { computed } from 'vue'
import { getContract, GetContractArgs, wrapTransaction } from './share'
import { useWalletStore } from '@/stores'

const addresses: Record<number, string> = {
  5: '0xEdf4565af54D9508e247c044F09EddcaD91DAdED',
  43113: '0x914CAC7A9075E9236DDDA055C390325D7bE85350',
  43114: '0x45BE0Eaa7076854d790A9583c6E3AE020d1A1556'
}

const abi =
  '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract BountyAddr","name":"addr","type":"address"}],"name":"createdBounty","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"createBounty","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"id","type":"string"},{"internalType":"address payable","name":"oriSender","type":"address"},{"internalType":"uint256","name":"oriVal","type":"uint256"},{"internalType":"uint256","name":"time","type":"uint256"}],"name":"invest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"receiver","type":"address"}],"name":"suicide0","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]'

export function useBountyContract(): {
  getContract: () => Contract
  createBounty: (p: [deposit: number], pendingText: string, waitingText: string) => Promise<[]>
} {
  const walletStore = useWalletStore()
  const getContractArgs = computed<GetContractArgs>(() => {
    return {
      abi,
      addresses,
      wallet: walletStore.wallet,
      chainId: walletStore.chainId
    }
  })
  return {
    getContract: () => getContract(getContractArgs.value),
    createBounty: wrapTransaction(getContractArgs.value, 'createBounty')
  }
}
