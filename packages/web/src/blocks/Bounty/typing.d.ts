export interface BountyInfo {
  current: number
  startupID: number | undefined
  title: string
  expiresIn: number | undefined
  contact: {
    type: number
    value: string
  }[]
  discussionLink: string
  applicantsSkills: never[]
  applicantsDeposit: number
  description: string
  payDetailType: string
  token1Symbol: string
  token2Symbol: string
  stages: { token1Amount: number; token2Amount: number; terms: string }[]
  period: {
    periodType: string
    periodAmount: number
    hoursPerDay: number
    target: string
    token1Amount: number
    token2Amount: number
  }
  deposit: number
  agreement: boolean
}

export interface CreateBountyFormRef {
  bountyInfo: BountyInfo
  modalVisibleState?: boolean
  bountyBasicInfoFields?: Ref<FormFactoryField[]>
  bountyBasicInfoRules?: Record<string, FormItemRule[]>
  payDetailPeriodFields?: Ref<FormFactoryField[]>
  payPeriodRules?: Record<string, FormItemRule[]>
  depositFields?: Ref<FormFactoryField[]>
  toFinanceSetting?: () => void
  bountyDetailForm?: ref<FormInst | null>
  payStageForm?: ref<FormInst | null>
  payPeriodForm?: ref<FormInst | null>
  renderUnit?: (name?: string) => JSX.Element
  renderSelect?: (name?: string) => JSX.Element
  delStage?: (index?: number) => void
  addStage?: () => void
  toPreviousStep?: () => void
  toNext?: () => void
  onSubmit?: () => void
  onCancel?: () => void
  payStagesTotal: ComputedRef<{
    usdcTotal: number
    tokenTotal: number
  }>
  stepOptions: Ref<
    {
      name: string
    }[]
  >
}
