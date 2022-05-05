import { Contract } from 'ethers'
import { wrapTransaction } from './share'
import { useWalletStore } from '@/stores'

const address = '<%= address %>'
const abi = '<%= abi %>'

let _contract: Contract | null = null

export function use<%= title %>Contract(): () => {
  contract: Contract<% abiArr.forEach(function(func, index) { %>
  <%= func.name %>: (<%=generateArgs(func.inputs) %>, pendingText: string, waitingText: string) => Promise<[<%= generateArgs(func.outputs, true) %>]><% }) %>
} {
  const walletStore = useWalletStore()
  return () => {
    const signer = walletStore.wallet?.getSigner()
    if (!signer) {
      throw new Error('Wallet is not initialized')
    }
    if (!_contract || address !== _contract.address || signer !== _contract.signer) {
      _contract = new Contract(address, abi, signer)
    }
    return {
      contract: _contract,
      <% abiArr.forEach(function(func, index) { %><%= func.name %>: wrapTransaction(_contract.<%= func.name %>),
      <% }) %>
    }
  }
}
