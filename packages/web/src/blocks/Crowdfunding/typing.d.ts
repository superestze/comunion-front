export interface CrowdfundingInfo {
  current: number
  startupId: number | undefined
  startupName?: string
  sellTokenContract?: string
  sellTokenName: string
  sellTokenSymbol: string
  sellTokenDecimals: string
  sellTokenSupply: string
  teamWallet: string
  raiseGoal: number | null
  buyTokenContract: string
  buyTokenName?: string
  buyTokenSymbol?: string
  swapPercent?: number
  buyPrice?: number
  maxBuyAmount?: number
  sellTax?: number
  maxSell?: number
  startTime?: string
  endTime?: string
  sellTokenDeposit: number
  poster?: FileInfo
  youtube: string
  detail: string
  description?: string
}
export type chainInfoType = {
  chainID: number | undefined
  onChain: boolean
}
export interface CrowdfundingFormRef {
  crowdfundingInfo: CrowdfundingInfo
  toPreviousStep?: () => void
  toNext?: () => void
  onSubmit?: () => void
  onCancel?: () => void
  showLeaveTipModal?: () => void
}
