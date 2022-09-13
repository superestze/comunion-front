export interface ContactType {
  type: number
  value: string
}
export interface BountyInfo {
  current: number
  startupID: number | undefined
  title: string
  expiresIn: number | undefined
  contact: ContactType[]
  discussionLink: string
  applicantsSkills: never[]
  applicantsDeposit: number
  description: string
  payDetailType: string
  token1Symbol: string
  token2Symbol: string
  stages: { token1Amount: number; token2Amount: number; terms: string }[]
  period: {
    periodType: number
    periodAmount: number
    hoursPerDay: number
    target: string
    token1Amount: number
    token2Amount: number
  }
  deposit: number
  agreement: boolean
  onChain: boolean
}
export type chainInfoType = {
  chainID: number | undefined
  onChain: boolean
}
export interface CreateBountyFormRef {
  bountyInfo: BountyInfo
  toPreviousStep?: () => void
  toNext?: () => void
  onSubmit?: () => void
  onCancel?: () => void
  showLeaveTipModal?: () => void
}
