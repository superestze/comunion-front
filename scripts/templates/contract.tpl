import { Contract } from 'ethers'

const address = '<%= address %>'
const abi = '<%= abi %>'
export function get<%= title %>ContractInstance(currentProvider){
  return new Contract(address, abi, currentProvider);
}
