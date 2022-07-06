import { Contract, BigNumber } from 'ethers'
import { computed } from 'vue'
import { getContract, GetContractArgs, wrapTransaction } from './share'
import { useWalletStore } from '@/stores'

export const addresses: Record<number, string> = {<% addresses.forEach(function(network) { %>
  <%= network.chainId %>: '<%= network.address %>',<% }) %>}

const abi = '<%= abi %>'

export function use<%= title %>Contract(): {
  getContract: () => Contract<% abiArr.forEach(function(func, index) { %>
  <%= func.name %>: (<%=generateArgs(func.inputs) %>, pendingText: string, waitingText: string) => Promise<[<%= generateArgs(func.outputs, true) %>]><% }) %>
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
    <% abiArr.forEach(function(func, index) { %><%= func.name %>: wrapTransaction(getContractArgs.value, '<%= func.name %>'),
    <% }) %>
  }
}
