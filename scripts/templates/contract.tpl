import { Contract } from 'ethers'
import { useWallet } from '@/providers'

const address = '<%= address %>'
const abi = '<%= abi %>'

let _contract: Contract = null

export function use<%= title %>Contract(): () => {
  contract: Contract<% abiArr.forEach(function(func, index) { %>
  <%= func.name %>: (<%=generateArgs(func.inputs) %>) => Promise<[<%= generateArgs(func.outputs, true) %>]><% }) %>
} {
  const { getWallet } = useWallet()
  return () => {
    const signer = getWallet()?.getSigner()
    if (!signer) {
      throw new Error('Wallet is not initialized')
    }
    if (!_contract || address !== _contract.address || signer !== _contract.signer) {
      _contract = new Contract(address, abi, signer)
    }
    return {
      contract: _contract,
      <% abiArr.forEach(function(func, index) { %><%= func.name %>: _contract.<%= func.name %>,
      <% }) %>
    }
  }
}
