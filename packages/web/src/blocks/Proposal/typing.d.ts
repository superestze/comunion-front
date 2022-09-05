export interface ProposalInfo {
  current: number
  startupId?: number
  title?: string
  description?: string
  discussion?: string
  vote?: number
  startTime?: string
  endTime?: string
  voteChoices: { value: string; disabled?: boolean }[]
}

export interface CreateProposalFormRef {
  proposalInfo: ProposalInfo
  toPreviousStep?: () => void
  toNext?: () => void
  onSubmit?: () => void
  onCancel?: () => void
  showLeaveTipModal?: () => void
}
