import type {
  JsonRpcSigner,
  Web3Provider
} from '.pnpm/@ethersproject+providers@5.4.0/node_modules/@ethersproject/providers'
import { providers } from 'ethers'
import type { DeepReadonly, Ref } from 'vue'
import { inject, provide, readonly, ref } from 'vue'

export interface EthProvideData {
  provider: Web3Provider
  signer: JsonRpcSigner
  address: DeepReadonly<Ref<string>>
  connectMetamask: () => Promise<void>
}

export const ethSymbol = Symbol()

let cachedAddress = ''
export const useEthProvider = () => {
  const provider = new providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const address = ref(cachedAddress)
  if (process.env.NODE_ENV === 'development') {
    window.provider = provider
  }
  async function connectMetamask() {
    await window.ethereum.enable()
    address.value = await signer.getAddress()
    cachedAddress = address.value
  }
  provide<EthProvideData>(ethSymbol, {
    provider: provider,
    signer: signer,
    address: readonly(address),
    connectMetamask
  })
}

export const useEthInject = () => {
  const ethContext = inject<EthProvideData>(ethSymbol)
  if (!ethContext) {
    throw new Error('useEthInject must be used after useEthProvider')
  }
  return {
    ...ethContext,
    address: ethContext.address
  }
}
