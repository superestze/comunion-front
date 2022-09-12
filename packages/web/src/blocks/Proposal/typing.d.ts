export interface ProposalInfo {
  current: number
  startupId?: number
  title?: string
  description?: string
  discussion?: string
  vote?: number
  startTime?: number
  endTime?: number
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

export interface VoteOption {
  label?: string
  value?: string
  remark?: string
  key?: number
}
