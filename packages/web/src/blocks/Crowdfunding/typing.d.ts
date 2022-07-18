export interface CrowdfundingInfo {
  current: number
  startupId: number | undefined
  sellTokenContract: string
  sellTokenName: string
  sellTokenSymbol: string
  sellTokenDecimals: string
  sellTokenSupply: string
  teamWallet: string
  raiseGoal: number | undefined
  buyTokenContract: string
  swapPercent: number | undefined
  buyPrice: string
  maxBuyAmount: string
  sellTax: string
  maxSell: string
  startTime: string
  endTime: string
  sellTokenDeposit: string
  poster: string
  youtube: string
  detail: string
  description: string
}

export interface CrowdfundingFormRef {
  crowdfundingInfo: CrowdfundingInfo
  toPreviousStep?: () => void
  toNext?: () => void
  onSubmit?: () => void
  onCancel?: () => void
  showLeaveTipModal?: () => void
}
