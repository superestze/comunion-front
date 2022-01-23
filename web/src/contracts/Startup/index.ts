import { Contract } from 'ethers'

const address = 'xxxxxxxxxxxxxxx'
const abi =
  '[{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"adopters","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"petId","type":"uint256"}],"name":"adopt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAdopters","outputs":[{"internalType":"address[16]","name":"","type":"address[16]"}],"stateMutability":"view","type":"function","constant":true}]'
export function getContractInstance(currentProvider) {
  return new Contract(address, abi, currentProvider)
}
