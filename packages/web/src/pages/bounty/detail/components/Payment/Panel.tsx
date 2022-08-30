import { UScrollbar } from '@comunion/components'
import { LockKeyOutlined, UnlockKeyOutlined } from '@comunion/icons'
import { defineComponent, PropType, computed } from 'vue'
import { ProjectCardWithDialog } from '../ProjectCard'
import ProjectCarousel from '../ProjectCarousel'
import Text from '../Text'
import PaymentCard from './Card'
import ReleaseApplicant from './ReleaseApplicant'
import AddDeposit from './addDeposit'
import ApplyBounty from './applyBounty'
import CloseBounty from './closeBounty'
import Lock from './lock'
import ReleaseDeposit from './releaseDeposit'
import { APPLICANT_STATUS, BOUNTY_STATUS, USER_ROLE } from '@/constants'
import { ServiceReturn } from '@/services'
import { BountyContractInfoType } from '@/stores/bountyContract'

export default defineComponent({
  props: {
    chainId: {
      type: Number,
      required: true
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
    const payMode = computed<'stage' | 'period'>(() => {
      return props.paymentInfo?.bountyPaymentInfo?.paymentMode === 1 ? 'stage' : 'period'
    })
    const chainId = props.chainId
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
      if (props.bountyContractInfo.role === USER_ROLE.APPLICANT) {
        if (props.bountyContractInfo.bountyStatus >= 2) {
          return props.bountyContractInfo.myDepositAmount
        }
      }
      return props.bountyContractInfo.applicantDepositAmount
    })
    console.log('role====', USER_ROLE, props.bountyContractInfo)
    return {
      payMode,
      chainId,
      stageTerms,
      periodTerms,
      bountyApplicantAmount
    }
  },
  render() {
    return (
      <>
        <div class="flex justify-between mt-26px">
          <PaymentCard
            title="Rewards"
            class="w-100 mr-2"
            v-slots={{
              btn: () => (
                <>
                  {this.bountyContractInfo.role != USER_ROLE.FOUNDER && (
                    <ApplyBounty
                      disabled={
                        this.bountyContractInfo.status === APPLICANT_STATUS.APPLIED ||
                        this.bountyContractInfo.bountyStatus >= BOUNTY_STATUS.WORKSTARTED
                      }
                      chainId={this.chainId}
                      applicantApplyStatus={this.bountyContractInfo.status}
                      applicantDepositMinAmount={this.bountyContractInfo.applicantDepositMinAmount}
                    />
                  )}
                  {this.bountyContractInfo.role === USER_ROLE.FOUNDER && <CloseBounty />}
                </>
              ),
              text: () => (
                <>
                  {this.paymentInfo?.rewards?.token1Symbol && (
                    <Text
                      value={`${this.paymentInfo.rewards.token1Amount || 0}`}
                      class="mt-60px"
                      unit={this.paymentInfo.rewards.token1Symbol}
                      enhance={true}
                    />
                  )}
                  <Text
                    value={`${this.paymentInfo?.rewards?.token2Amount || 0}`}
                    class="mt-40px"
                    unit={this.paymentInfo?.rewards?.token2Symbol || 'TOKEN'}
                    plus={true}
                    enhance={true}
                  />
                </>
              )
            }}
          />
          <PaymentCard
            class="w-100"
            lock={this.bountyContractInfo.depositLock}
            v-slots={{
              title: () => (
                <p
                  class="flex justify-between items-center h-72px"
                  style={{
                    backgroundColor: this.bountyContractInfo.depositLock
                      ? 'rgba(223, 79, 81, 0.12)'
                      : '#F5F6FA'
                  }}
                >
                  <span class="text-20px ml-24px opacity-100">Deposit</span>
                  {this.bountyContractInfo.depositLock ? (
                    <LockKeyOutlined class="mr-6" />
                  ) : (
                    <UnlockKeyOutlined class="mr-6" />
                  )}
                </p>
              ),
              btn: () => (
                <>
                  {this.bountyContractInfo.role != USER_ROLE.FOUNDER && (
                    <>
                      {this.bountyContractInfo.bountyStatus < BOUNTY_STATUS.WORKSTARTED && (
                        <ReleaseApplicant
                          disabled={this.bountyContractInfo.status !== APPLICANT_STATUS.APPLIED}
                        />
                      )}
                      {this.bountyContractInfo.bountyStatus >= BOUNTY_STATUS.WORKSTARTED &&
                        this.bountyContractInfo.status !== APPLICANT_STATUS.APPROVED && (
                          <ReleaseApplicant disabled={true} />
                        )}
                      {this.bountyContractInfo.status === APPLICANT_STATUS.APPROVED && <Lock />}
                    </>
                  )}
                  {this.bountyContractInfo.role === USER_ROLE.FOUNDER && (
                    <>
                      {this.bountyContractInfo.timeLock === 0 &&
                      this.bountyContractInfo.depositLock ? (
                        <Lock />
                      ) : (
                        <div class="flex w-322px mt-60px mb-48px mx-auto">
                          <AddDeposit />
                          <ReleaseDeposit />
                        </div>
                      )}
                    </>
                  )}
                </>
              ),
              text: () => (
                <>
                  <Text
                    class="mt-60px"
                    text-color="text-warning"
                    value={`${this.bountyContractInfo.founderDepositAmount || 0}`}
                    enhance={true}
                    v-slots={{
                      unit: () => (
                        <span class="flex flex-col justify-end pb-6px text-grey5">
                          <span class="text-16px">USDC</span>
                          <span class="text-16px">Founder</span>
                        </span>
                      )
                    }}
                  />
                  <Text
                    class="mt-40px"
                    text-color="text-warning"
                    value={`${this.bountyApplicantAmount}`}
                    enhance={true}
                    v-slots={{
                      unit: () => (
                        <span class="flex flex-col justify-end pb-6px text-grey5">
                          <span>USDC</span>
                          <span>Applicant</span>
                        </span>
                      )
                    }}
                  />
                </>
              )
            }}
          />
        </div>
        <div class="n-card-header my-40px">
          <div class="n-card-header__main" role="heading">
            TERMS
          </div>
          <div class="subtitle">
            {this.payMode === 'stage' ? (
              <>
                <span class="text-grey3 text-16px">Total Stage:</span>
                <span class="text-primary text-16px">{this.stageTerms.length}</span>
              </>
            ) : (
              <>
                <span class="text-grey3 text-16px">Total Period:</span>
                <span class="text-primary text-16px">
                  {' '}
                  {this.periodTerms.length} {this.periodTerms.length === 1 ? 'week' : 'weeks'}
                </span>
                <span class="text-grey3 text-16px ml-61px">Daily working:</span>
                <span class="text-primary text-16px">{this.paymentInfo?.stageTerms?.length}</span>
              </>
            )}
          </div>
        </div>
        <ProjectCarousel
          width={820}
          total={this.payMode === 'stage' ? this.stageTerms.length : this.periodTerms.length}
        >
          {this.payMode === 'stage' ? (
            <>
              {this.stageTerms.map(term => (
                <ProjectCardWithDialog info={term} payMode={this.payMode} />
              ))}
            </>
          ) : (
            <>
              {this.periodTerms.map(term => (
                <ProjectCardWithDialog info={term} payMode={this.payMode} />
              ))}
            </>
          )}
        </ProjectCarousel>
        {this.payMode === 'period' && (
          <div class="max-h-258px overflow-hidden mt-24px border-grey5 border-width-1px border-solid rounded-8px p-24px">
            <p class="text-grey1 text-20px mb-24px">Target</p>
            <UScrollbar style={{ maxHeight: `${162}px` }}>
              <p class="text-grey2 mx-24px" innerHTML={this.paymentInfo?.periodTerms?.terms} />
            </UScrollbar>
          </div>
        )}
      </>
    )
  }
})
