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
import { ServiceReturn } from '@/services'

export default defineComponent({
  props: {
    paymentInfo: {
      type: Object as PropType<ServiceReturn<'bounty@bounty-payment'>>,
      required: true
    },
    stageNum: {
      type: Number,
      require: true,
      default: () => 0
    },
    bountyStatus: {
      type: Object as PropType<ServiceReturn<'bounty@bounty-detail-status'>>,
      require: true
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

    const bountyDepositLock = computed<boolean>(() => {
      return props.paymentInfo?.bountyDepositStatus === 3
    })

    const roleName = computed<string>(() => {
      if (props.bountyStatus?.role === 1) {
        return 'founder'
      }
      return 'applicant'
    })

    const applicantApplyStatus = computed<number>(() => {
      if (typeof props.paymentInfo?.applicantApplyStatus === 'number') {
        return props.paymentInfo?.applicantApplyStatus
      }
      return -1
    })

    return {
      payMode,
      stageTerms,
      periodTerms,
      bountyDepositLock,
      roleName,
      applicantApplyStatus
    }
  },
  render() {
    return (
      <>
        <div class="flex justify-between mt-26px">
          <PaymentCard
            title="Rewards"
            class="w-401px"
            v-slots={{
              btn: () => (
                <>
                  {this.roleName === 'applicant' && (
                    <ApplyBounty
                      disabled={this.stageNum >= 2 || this.applicantApplyStatus >= 0}
                      applicantApplyStatus={this.applicantApplyStatus}
                      applicantDeposit={this.paymentInfo?.bountyPaymentInfo?.applicantDeposit}
                    />
                  )}
                  {this.roleName === 'founder' && <CloseBounty disibled={this.stageNum >= 3} />}
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
                  {this.paymentInfo?.rewards?.token2Symbol && (
                    <Text
                      value={`${this.paymentInfo.rewards.token2Amount || 0}`}
                      class="mt-40px"
                      unit={this.paymentInfo.rewards.token2Symbol}
                      plus={true}
                      enhance={true}
                    />
                  )}
                </>
              )
            }}
          />
          <PaymentCard
            class="w-401px"
            lock={this.bountyDepositLock}
            v-slots={{
              title: () => (
                <p
                  class="flex justify-between items-center h-72px"
                  style={{
                    backgroundColor: this.bountyDepositLock ? 'rgba(223, 79, 81, 0.12)' : '#F5F6FA'
                  }}
                >
                  <span class="text-20px ml-24px opacity-100">Deposit</span>
                  {this.bountyDepositLock ? (
                    <LockKeyOutlined class="mr-24px" />
                  ) : (
                    <UnlockKeyOutlined class="mr-24px" />
                  )}
                </p>
              ),
              btn: () => (
                <>
                  {this.stageNum >= 2 && this.roleName === 'applicant' && (
                    <Lock lock={this.bountyDepositLock} />
                  )}
                  {this.stageNum < 3 && this.roleName === 'founder' && (
                    <div class="flex w-322px mt-60px mb-48px mx-auto">
                      <AddDeposit disibled={this.bountyStatus?.release} />
                      <ReleaseDeposit lock={this.bountyDepositLock} />
                    </div>
                  )}
                  {this.roleName === 'applicant' && this.stageNum === 1 && (
                    <ReleaseApplicant
                      disabled={(this.paymentInfo?.bountyPaymentInfo?.applicantDeposit || 0) === 0}
                    />
                  )}
                </>
              ),
              text: () => (
                <>
                  <Text
                    class="mt-60px"
                    text-color="text-warning"
                    value={`${this.paymentInfo?.bountyPaymentInfo?.founderDeposit || 0}`}
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
                    value={`${this.paymentInfo?.applicantsTotalDeposit || 0}`}
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
