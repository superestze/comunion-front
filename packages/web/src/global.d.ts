import type {
  ExternalProvider,
  Web3Provider
} from '.pnpm/@ethersproject+providers@5.4.0/node_modules/@ethersproject/providers'

declare global {
  interface Window {
    ethereum: ExternalProvider & {
      enable: () => Promise<any>
    }
    provider: Web3Provider
  }
}
