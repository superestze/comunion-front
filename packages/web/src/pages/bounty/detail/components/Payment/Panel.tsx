import { UScrollbar } from '@comunion/components'
import { LockKeyOutlined, UnlockKeyOutlined } from '@comunion/icons'
import { defineComponent, PropType, computed, ref } from 'vue'
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
              btn: () => (
                <>
                  {this.bountyContractInfo.role != USER_ROLE.FOUNDER && (
                    <ApplyBounty
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
                    <CloseBounty detailChainId={this.detailChainId} />
                  )}
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
              btn: () => (
                <>
                  {this.bountyContractInfo.role != USER_ROLE.FOUNDER && (
                    <>
                      {this.bountyContractInfo.bountyStatus < BOUNTY_STATUS.WORKSTARTED && (
                        <ReleaseApplicant
                          detailChainId={this.detailChainId}
                          disabled={this.bountyContractInfo.status !== APPLICANT_STATUS.APPLIED}
                        />
                      )}
                      {this.bountyContractInfo.bountyStatus >= BOUNTY_STATUS.WORKSTARTED &&
                        this.bountyContractInfo.status !== APPLICANT_STATUS.APPROVED &&
                        this.bountyContractInfo.status !== APPLICANT_STATUS.UNAPPROVED && (
                          <ReleaseApplicant detailChainId={this.detailChainId} disabled={true} />
                        )}
                      {(this.bountyContractInfo.status === APPLICANT_STATUS.APPROVED ||
                        this.bountyContractInfo.status === APPLICANT_STATUS.UNAPPROVED) && (
                        <Lock detailChainId={this.detailChainId} />
                      )}
                    </>
                  )}
                  {this.bountyContractInfo.role === USER_ROLE.FOUNDER && (
                    <>
                      {this.bountyContractInfo.approvedStatus === APPLICANT_STATUS.APPROVED &&
                      this.bountyContractInfo.timeLock > 0 &&
                      this.time - this.bountyContractInfo.timeLock >= 0 &&
                      this.bountyContractInfo.depositLock ? (
                        <Lock detailChainId={this.detailChainId} />
                      ) : (
                        <div class="flex mx-auto mt-60px mb-48px w-322px">
                          <AddDeposit detailChainId={this.detailChainId} />
                          <ReleaseDeposit detailChainId={this.detailChainId} />
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
                    unit="USDC"
                    enhance={true}
                  />
                  <Text
                    class="mt-40px"
                    text-color="text-warning"
                    value={`${this.bountyApplicantAmount}`}
                    enhance={true}
                    unit="USDC"
                  />
                </>
              )
            }}
          />
        </div>
        <div class="my-40px n-card-header">
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
                <span class="ml-61px text-grey3 text-16px">Daily working:</span>
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
                <ProjectCardWithDialog
                  detailChainId={this.detailChainId}
                  info={term}
                  payMode={this.payMode}
                />
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
          <div class="border-solid border-grey5 border-width-1px rounded-8px mt-24px max-h-258px p-24px overflow-hidden">
            <p class="mb-24px text-grey1 text-20px">Target</p>
            <UScrollbar style={{ maxHeight: `${162}px` }}>
              <p class="mx-24px text-grey2" innerHTML={this.paymentInfo?.periodTerms?.terms} />
            </UScrollbar>
          </div>
        )}
      </>
    )
  }
})
