import type { JsonRpcProvider } from '@ethersproject/providers'
import type { providers } from 'ethers'
import { ChainNetworkType } from '@/constants'

export default abstract class AbstractWallet {
  _name: string
  _provider: JsonRpcProvider
  constructor(name: string, provider: providers.JsonRpcProvider) {
    this._name = name
    this._provider = provider
  }
  getProvider(): providers.JsonRpcProvider {
    return this._provider
  }
  getSigner(): providers.JsonRpcSigner {
    return this._provider.getSigner()
  }
  getAddress(): Promise<string> {
    return this.getSigner().getAddress()
  }
  abstract checkAvaliable(): boolean
  abstract prepare(): Promise<string | undefined> | undefined
  sign(nonce: string): Promise<string> {
    return this._provider.getSigner().signMessage(nonce)
  }
  abstract addNetwork(network: ChainNetworkType): Promise<boolean>
  abstract switchNetwork(chainId: number): Promise<boolean>
}
