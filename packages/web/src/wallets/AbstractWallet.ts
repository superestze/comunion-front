import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer'
import type { JsonRpcProvider } from '@ethersproject/providers'
import type { providers } from 'ethers'
import { ChainNetworkType } from '@/constants'

export default abstract class AbstractWallet {
  _name: string
  _provider: JsonRpcProvider
  _instance: AbstractWallet | undefined
  constructor(name: string, provider: JsonRpcProvider) {
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
  abstract prepare(): Promise<string | undefined> | undefined
  sign(nonce: string): Promise<string> {
    return this._provider.getSigner().signMessage(nonce)
  }
  signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>
  ): Promise<string> {
    return this._provider.getSigner()._signTypedData(domain, types, value)
  }
  abstract addNetwork(network: ChainNetworkType): Promise<boolean>
  abstract switchNetwork(chainId: number): Promise<boolean>
}
