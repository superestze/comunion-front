import { UScrollbar, UTooltip } from '@comunion/components'
import { LockKeyOutlined, UnlockKeyOutlined } from '@comunion/icons'
import { pluralize } from 'inflected'
import { defineComponent, PropType, computed, ref } from 'vue'
import { ProjectCardWithDialog } from '../ProjectCard'
import ProjectCarousel from '../ProjectCarousel'
import Text from '../Text'
import ReleaseApplicant from './ReleaseApplicant'
import StageTerm from './StageTerm'
import AddDeposit from './addDeposit'
import ApplyBounty from './applyBounty'
import CloseBounty from './closeBounty'
import Lock from './lock'
import ReleaseDeposit from './releaseDeposit'
import PaymentCard from '@/components/CustomCard'
import { APPLICANT_STATUS, BOUNTY_STATUS, USER_ROLE, PERIOD_OPTIONS } from '@/constants'
import { ServiceReturn } from '@/services'
import { BountyContractInfoType } from '@/stores/bountyContract'

export default defineComponent({
  name: 'Payment',
  props: {
    detailChainId: {
      type: Number,
      default: () => 0
    },
    bountyContractInfo: {
      type: Object as PropType<BountyContractInfoType>,
      required: true
    },
    paymentInfo: {
      type: Object as PropType<ServiceReturn<'bounty@bounty-payment'>>,
      required: true
    },
    bountyDetail: {
      type: Object,
      required: true
    },
    bountyExpired: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const payMode = computed<'stage' | 'period'>(() => {
      return props.paymentInfo?.bountyPaymentInfo?.paymentMode === 1 ? 'stage' : 'period'
    })
    const stageTerms = computed(() => {
      if (props.paymentInfo?.stageTerms && Array.isArray(props.paymentInfo.stageTerms)) {
        return props.paymentInfo.stageTerms
      }
      return []
    })

    const periodTerms = computed(() => {
      if (
        props.paymentInfo?.periodTerms?.periodModes &&
        Array.isArray(props.paymentInfo?.periodTerms?.periodModes)
      ) {
        return props.paymentInfo.periodTerms.periodModes
      }
      return []
    })

    const bountyApplicantAmount = computed(() => {
      // console.log(props.bountyContractInfo)
      // if (props.bountyContractInfo.role === USER_ROLE.APPLICANT) {
      //   if (props.bountyContractInfo.bountyStatus >= 2) {
      //     return props.bountyContractInfo.applicantDepositAmount
      //   }
      // }
      return props.bountyContractInfo.applicantDepositAmount
    })
    const time = ref(0)

    const timer = () => {
      time.value = Date.now() / 1000
      setTimeout(timer, 1000)
    }

    timer()

    const expiresIn = computed(() => new Date(props.bountyDetail.value.expiresIn).getTime() / 1000)

    return {
      payMode,
      stageTerms,
      periodTerms,
      bountyApplicantAmount,
      time,
      expiresIn
    }
  },
  render() {
    const getPeriodByType = (type: number) => {
      const targetIndex = PERIOD_OPTIONS.findIndex(opt => opt.value === type)
      if (targetIndex !== -1) {
        return PERIOD_OPTIONS[targetIndex].type
      }
      return ''
    }
    const periodType = getPeriodByType(this.paymentInfo?.periodTerms?.periodType || 1)

    return (
      <>
        <div class="flex">
          <PaymentCard class="flex-1 mr-8" title="Rewards">
            <div class="flex flex-col h-44 items-center">
              <div class="flex flex-1 items-end">
                <div>
                  {this.paymentInfo?.rewards?.token1Symbol && (
                    <Text
                      value={`${this.paymentInfo.rewards.token1Amount || 0}`}
                      unit={this.paymentInfo.rewards.token1Symbol}
                      enhance={40}
                      digit={4}
                    />
                  )}
                  <Text
                    value={`${this.paymentInfo?.rewards?.token2Amount || 0}`}
                    class="mt-10"
                    unit={this.paymentInfo?.rewards?.token2Symbol || 'TOKEN'}
                    plus={true}
                    enhance={40}
                    digit={4}
                  />
                </div>
              </div>
            </div>
            {(this.bountyContractInfo.role != USER_ROLE.FOUNDER ||
              this.bountyContractInfo.role === USER_ROLE.FOUNDER) && (
              <div class="flex mt-12 mb-4">
                {this.bountyContractInfo.role != USER_ROLE.FOUNDER && (
                  <ApplyBounty
                    class="flex-1"
                    disabled={
                      this.bountyContractInfo.status === APPLICANT_STATUS.APPLIED ||
                      this.bountyContractInfo.bountyStatus >= BOUNTY_STATUS.WORKSTARTED ||
                      this.expiresIn <= this.time
                    }
                    bountyExpired={this.bountyExpired}
                    detailChainId={this.detailChainId}
                    applicantApplyStatus={this.bountyContractInfo.status}
                    applicantDepositMinAmount={this.bountyContractInfo.applicantDepositMinAmount}
                  />
                )}
                {this.bountyContractInfo.role === USER_ROLE.FOUNDER && (
                  <CloseBounty
                    class="flex-1"
                    detailChainId={this.detailChainId}
                    bountyContractInfo={this.bountyContractInfo}
                    bountyDetail={this.bountyDetail}
                  />
                )}
              </div>
            )}
          </PaymentCard>
          <PaymentCard
            class="flex-1"
            lock={this.bountyContractInfo.depositLock}
            v-slots={{
              title: () => (
                <div
                  class={`flex items-center overflow-hidden border-b p-4 ${
                    this.bountyContractInfo.depositLock
                      ? 'bg-[#fbeaea] border-error'
                      : 'bg-purple border-b border-color-border'
                  }`}
                >
                  <div class="flex-1 text-color1 u-h4">Deposit</div>
                  {this.bountyContractInfo.depositLock ? (
                    <UTooltip>
                      {{
                        trigger: () => <LockKeyOutlined />,
                        default: () => (
                          <div>
                            <p>The deposit is locked ！</p>
                            <p>
                              1.The deposit can be unlocked by approved appicant and be released by
                              founder.
                            </p>
                            <p>
                              2.The approved applicant need to post update at least 1 time within 5
                              days in the working for bounty
                            </p>
                          </div>
                        )
                      }}
                    </UTooltip>
                  ) : (
                    <UnlockKeyOutlined />
                  )}
                </div>
              )
            }}
          >
            <div class="flex flex-col h-44 items-center">
              <div class="flex flex-1 items-end">
                <div>
                  <p class="h-6 px-1 text-grey3 u-body4">Founder </p>
                  <Text
                    textColor="text-warning"
                    value={`${this.bountyContractInfo.founderDepositAmount || 0}`}
                    unit={this.bountyContractInfo.depositTokenSymbol}
                    enhance={40}
                    digit={4}
                  />
                  <p class="h-6 mt-4 px-1 text-grey3 u-body4">Applicant </p>
                  <Text
                    textColor="text-warning"
                    value={`${this.bountyApplicantAmount}`}
                    enhance={40}
                    digit={4}
                    unit={this.bountyContractInfo.depositTokenSymbol}
                  />
                </div>
              </div>
            </div>
            <div class="flex mt-12 mb-4">
              {this.bountyContractInfo.role != USER_ROLE.FOUNDER && (
                <>
                  {this.bountyContractInfo.bountyStatus < BOUNTY_STATUS.WORKSTARTED && (
                    <ReleaseApplicant
                      class="flex-1"
                      detailChainId={this.detailChainId}
                      disabled={this.bountyContractInfo.status !== APPLICANT_STATUS.APPLIED}
                    />
                  )}
                  {this.bountyContractInfo.bountyStatus >= BOUNTY_STATUS.WORKSTARTED &&
                    this.bountyContractInfo.status !== APPLICANT_STATUS.APPROVED &&
                    this.bountyContractInfo.status !== APPLICANT_STATUS.UNAPPROVED && (
                      <ReleaseApplicant
                        class="flex-1"
                        detailChainId={this.detailChainId}
                        disabled={true}
                      />
                    )}
                  {(this.bountyContractInfo.status === APPLICANT_STATUS.APPROVED ||
                    this.bountyContractInfo.status === APPLICANT_STATUS.UNAPPROVED) && (
                    <Lock detailChainId={this.detailChainId} class="flex-1" />
                  )}
                </>
              )}
              {this.bountyContractInfo.role === USER_ROLE.FOUNDER && (
                <>
                  {this.bountyContractInfo.approvedStatus === APPLICANT_STATUS.APPROVED &&
                  this.bountyContractInfo.timeLock > 0 &&
                  this.time - this.bountyContractInfo.timeLock >= 0 &&
                  this.bountyContractInfo.depositLock ? (
                    <Lock detailChainId={this.detailChainId} class="flex-1" />
                  ) : (
                    <div class="flex flex-1 gap-4">
                      <AddDeposit
                        detailChainId={this.detailChainId}
                        bountyDetail={this.bountyDetail}
                        class="flex-1"
                      />
                      <ReleaseDeposit
                        detailChainId={this.detailChainId}
                        bountyDetail={this.bountyDetail}
                        class="flex-1"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </PaymentCard>
        </div>
        <div class="flex mt-10 mb-6 justify-between">
          <div class="font-primary font-medium text-color3">Terms</div>
          {this.payMode === 'stage' && (
            <div class="mt-2 u-h7">
              <span class="text-color3">Total Stage: </span>
              <span class="text-primary ">{this.stageTerms.length}</span>
            </div>
          )}

          {this.payMode === 'period' && (
            <div class="mt-2 u-h7">
              <span class="text-color3">Total Period: </span>
              <span class="text-primary">
                {`${this.periodTerms.length} ${
                  this.periodTerms.length > 1 ? pluralize(periodType) : periodType
                }`}
              </span>
              <span class="font-primary ml-10 text-grey3">Daily working: </span>
              <span class="text-primary">
                {`${this.paymentInfo?.periodTerms?.hoursPerDay || 0} ${
                  (this.paymentInfo?.periodTerms?.hoursPerDay || 0) > 1 ? pluralize('Hour') : 'Hour'
                }`}
              </span>
            </div>
          )}
        </div>

        {this.payMode === 'stage' &&
          this.stageTerms.map(item => <StageTerm item={item} detailChainId={this.detailChainId} />)}

        {this.payMode === 'period' && (
          <ProjectCarousel width={820} total={this.periodTerms.length}>
            {this.periodTerms.map(term => (
              <ProjectCardWithDialog info={term} />
            ))}
          </ProjectCarousel>
        )}

        {this.payMode === 'period' && (
          <div class="border-solid border-color-border border-width-1px rounded-8px mt-24px max-h-258px p-24px overflow-hidden">
            <p class="mb-6 u-title1">Target</p>
            <UScrollbar style={{ maxHeight: `${162}px` }}>
              <p class="text-grey2 u-h5" innerHTML={this.paymentInfo?.periodTerms?.terms} />
            </UScrollbar>
          </div>
        )}
      </>
    )
  }
})
