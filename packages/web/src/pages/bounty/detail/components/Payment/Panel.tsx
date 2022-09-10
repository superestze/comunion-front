import { UScrollbar } from '@comunion/components'
import { LockKeyOutlined, UnlockKeyOutlined } from '@comunion/icons'
import { pluralize } from 'inflected'
import { defineComponent, PropType, computed, ref } from 'vue'
import { ProjectCardWithDialog } from '../ProjectCard'
import ProjectCarousel from '../ProjectCarousel'
import Text from '../Text'
import PaymentCard from './Card'
import ReleaseApplicant from './ReleaseApplicant'
import StageTerm from './StageTerm'
import AddDeposit from './addDeposit'
import ApplyBounty from './applyBounty'
import CloseBounty from './closeBounty'
import Lock from './lock'
import ReleaseDeposit from './releaseDeposit'
import { APPLICANT_STATUS, BOUNTY_STATUS, USER_ROLE, PERIOD_OPTIONS } from '@/constants'
import { ServiceReturn } from '@/services'
import { useBountyStore } from '@/stores'
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
    }
  },
  setup(props) {
    const bountyStore = useBountyStore()
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
    const expiresIn = computed(() => new Date(bountyStore.detail?.expiresIn || '').getTime() / 1000)
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
        <div class="flex mt-8 ">
          <PaymentCard
            class="flex-1 mr-8"
            v-slots={{
              title: () => (
                <p
                  class="flex h-16 px-6 items-center"
                  style={{
                    backgroundColor: this.bountyContractInfo.depositLock
                      ? 'rgba(223, 79, 81, 0.12)'
                      : '#F5F6FA'
                  }}
                >
                  <span class="flex-1 u-title3">Rewards</span>
                </p>
              ),
              text: () => (
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
                        class="mt-9"
                        unit={this.paymentInfo?.rewards?.token2Symbol || 'TOKEN'}
                        plus={true}
                        enhance={40}
                        digit={4}
                      />
                    </div>
                  </div>
                </div>
              ),
              btn: () => (
                <div class="flex my-10 mx-1/9 ">
                  {this.bountyContractInfo.role != USER_ROLE.FOUNDER && (
                    <ApplyBounty
                      class="flex-1"
                      disabled={
                        this.bountyContractInfo.status === APPLICANT_STATUS.APPLIED ||
                        this.bountyContractInfo.bountyStatus >= BOUNTY_STATUS.WORKSTARTED ||
                        this.expiresIn <= this.time
                      }
                      detailChainId={this.detailChainId}
                      applicantApplyStatus={this.bountyContractInfo.status}
                      applicantDepositMinAmount={this.bountyContractInfo.applicantDepositMinAmount}
                    />
                  )}
                  {this.bountyContractInfo.role === USER_ROLE.FOUNDER && (
                    <CloseBounty class="flex-1" detailChainId={this.detailChainId} />
                  )}
                </div>
              )
            }}
          />
          <PaymentCard
            class="flex-1"
            lock={this.bountyContractInfo.depositLock}
            v-slots={{
              title: () => (
                <p
                  class="flex h-16 px-6 items-center"
                  style={{
                    backgroundColor: this.bountyContractInfo.depositLock
                      ? 'rgba(223, 79, 81, 0.12)'
                      : '#F5F6FA'
                  }}
                >
                  <span class="flex-1 u-title3">Deposit</span>
                  {this.bountyContractInfo.depositLock ? (
                    <LockKeyOutlined />
                  ) : (
                    <UnlockKeyOutlined />
                  )}
                </p>
              ),
              text: () => (
                <div class="flex flex-col h-44 items-center">
                  <div class="flex flex-1 items-end">
                    <div>
                      <p class="h-6 px-1 text-grey3 u-body4">Founder </p>
                      <Text
                        textColor="text-warning"
                        value={`${this.bountyContractInfo.founderDepositAmount || 0}`}
                        unit="USDC"
                        enhance={40}
                        digit={4}
                      />
                      <p class="h-6 mt-3 px-1 text-grey3 u-body4">Applicant </p>
                      <Text
                        textColor="text-warning"
                        value={`${this.bountyApplicantAmount}`}
                        enhance={40}
                        digit={4}
                        unit="USDC"
                      />
                    </div>
                  </div>
                </div>
              ),
              btn: () => (
                <div class="flex my-10 mx-1/9 ">
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
                          <AddDeposit detailChainId={this.detailChainId} class="flex-1" />
                          <ReleaseDeposit detailChainId={this.detailChainId} class="flex-1" />
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            }}
          />
        </div>
        <div class="mt-16 mb-10">
          <div class="text-primary1 u-card-title1">TERMS</div>
          {this.payMode === 'stage' && (
            <div class="mt-2 ">
              <span class="text-grey3 text-16px">Total Stage: </span>
              <span class="text-primary text-16px">{this.stageTerms.length}</span>
            </div>
          )}

          {this.payMode === 'period' && (
            <div class="mt-2 ">
              <span class="text-grey3 text-16px">Total Period: </span>
              <span class="text-primary text-16px">
                {`${this.periodTerms.length} ${
                  this.periodTerms.length > 1 ? pluralize(periodType) : periodType
                }`}
              </span>
              <span class="ml-10 text-grey3 text-16px">Daily working: </span>
              <span class="text-primary text-16px">
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
          <div class="border-solid border-grey5 border-width-1px rounded-8px mt-24px max-h-258px p-24px overflow-hidden">
            <p class="mb-6 u-title1">Target</p>
            <UScrollbar style={{ maxHeight: `${162}px` }}>
              <p class="text-grey2 u-body2" innerHTML={this.paymentInfo?.periodTerms?.terms} />
            </UScrollbar>
          </div>
        )}
      </>
    )
  }
})
