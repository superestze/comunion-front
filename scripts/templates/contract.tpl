import { Contract } from 'ethers'

const address = '<%= address %>'
const abi = '<%= abi %>'
export function getContractInstance(currentProvider){
  return new Contract(address, abi, currentProvider);
}
