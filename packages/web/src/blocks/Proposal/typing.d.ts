export interface ProposalInfo {
  current: number
  startupId?: number
  title?: string
  description?: string
  discussion?: string
  vote?: number
  startTime?: string
  endTime?: string
  voteChoices: string[]
}

export interface CreateProposalFormRef {
  proposalInfo: ProposalInfo
  toPreviousStep?: () => void
  toNext?: () => void
  onSubmit?: () => void
  onCancel?: () => void
  showLeaveTipModal?: () => void
}
