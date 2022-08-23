import { UBreadcrumb, UBreadcrumbItem, UCard, USpin, UTooltip } from '@comunion/components'
import { ArrowLeftOutlined, PeriodOutlined, StageOutlined, ClockOutlined } from '@comunion/icons'
import { defineComponent, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import BountyCard from './components/BountyCard'
import { ActivityBubble, ApplicantBubble, DepositBubble } from './components/Bubble'
import { Payment } from './components/Payment'
import PersonalCard from './components/PersonalCard'
import PostUpdate from './components/PostUpdate'
import StartupCard from './components/StartupCard'
import Unapprove from './components/Unapprove'
import { useBountyContractWrapper } from './hooks/useBountyContractWrapper'
import { BOUNTY_STATUS, USER_ROLE } from '@/constants'
import { getChainInfoByChainId } from '@/pages/crowdfunding/utils'
import router from '@/router'
import { useBountyStore } from '@/stores'
import { useBountyContractStore } from '@/stores/bountyContract'

export default defineComponent({
  name: 'BountyDetail',
  setup() {
    const route = useRoute()
    const bountyStore = useBountyStore()

    const loading = ref<boolean>(true)

    bountyStore.initialize(route.query.bountyId as string).finally(() => {
      loading.value = false
    })
    const bountySection = computed(() => bountyStore.bountySection)

    const bountyContractStore = useBountyContractStore()
    const { bountyContract, gap, chainId } = useBountyContractWrapper()
    bountyContractStore.initialize(bountyContract, route.query.bountyId as string, true)

    const chainInfo = getChainInfoByChainId(chainId as number)

    return {
      bountySection,
      loading,
      bountyContractInfo: bountyContractStore.bountyContractInfo,
      gap,
      chainInfo
    }
  },
  render() {
    return (
      <USpin show={this.loading}>
        <UBreadcrumb class="mb-10 mt-10">
          <UBreadcrumbItem v-slots={{ separator: () => <ArrowLeftOutlined /> }} />
          <UBreadcrumbItem>
            <span class="u-label2 cursor-pointer uppercase text-primary" onClick={router.back}>
              BACK
            </span>
          </UBreadcrumbItem>
        </UBreadcrumb>
        <div class="flex gap-6 mb-20">
          <div class="basis-2/3">
            <div class="bg-white p-10 rounded-lg border mb-6">
              {this.bountySection.detail && <BountyCard bountyDetail={this.bountySection.detail} />}
            </div>
            <UCard
              title="PAYMENT"
              class="mb-6 !pb-8"
              v-slots={{
                header: () => (
                  <div class="flex justify-between">
                    <p class="flex items-center">
                      <span>PAYMENT</span>
                      {this.bountySection.bountyPayment?.bountyPaymentInfo?.paymentMode === 1 ? (
                        <>
                          <StageOutlined class="ml-26px" />
                          <p class="text-14px ml-14px flex items-center">PERIOD: STAGE</p>
                        </>
                      ) : (
                        <>
                          <PeriodOutlined class="ml-26px" />
                          <p class="text-14px ml-14px flex items-center">PERIOD: WEEK</p>
                        </>
                      )}
                    </p>
                    <div class="flex bg-[rgba(83,49,244,0.06)] h-34px items-center rounded-35px justify-center font-opensans">
                      <span class="flex items-center px-4 py-1 rounded-4xl leading-snug text-primary1 ml-8px text-16px">
                        <img src={this.chainInfo?.logo} class="w-5 h-5" />{' '}
                        <span class="ml-2 font-opensans">{this.chainInfo?.name}</span>
                      </span>
                    </div>
                  </div>
                )
              }}
            >
              {this.bountySection.bountyPayment && (
                <Payment
                  bountyContractInfo={this.bountyContractInfo}
                  paymentInfo={this.bountySection.bountyPayment}
                />
              )}
            </UCard>
            <UCard
              title="ACTIVITIES"
              class="mb-6"
              v-slots={{
                'header-extra': () => {
                  if (
                    this.bountySection.activitiesList &&
                    this.bountySection.activitiesList.length > 0
                  ) {
                    return (
                      <div class="flex items-center">
                        {this.bountyContractInfo.bountyStatus >= BOUNTY_STATUS.WORKSTARTED && (
                          <>
                            <UTooltip placement="bottom">
                              {{
                                trigger: () => (
                                  <ClockOutlined
                                    class={`${
                                      this.gap >= 0 ? 'text-grey4' : 'text-error'
                                    } w-4 h-4 mr-2.5`}
                                  />
                                ),
                                default: () => (
                                  <div class="text-white w-84">
                                    Post an update at least every 5 days, otherwise you will lose
                                    the permission to lock the deposit, and the founder can unlock.
                                  </div>
                                )
                              }}
                            </UTooltip>
                            {this.gap >= 0 ? (
                              <p class="u-body3 text-grey3 flex items-center mr-4">
                                Founder can unlock after{' '}
                                <span class="text-parimary mx-1">{this.gap}</span> days
                              </p>
                            ) : (
                              <p class="u-body3 text-error flex items-center mr-4">
                                Founder can already unlock deposits
                              </p>
                            )}
                          </>
                        )}
                        <PostUpdate />
                      </div>
                    )
                  }
                  return
                }
              }}
            >
              {this.bountySection.activitiesList && this.bountySection.activitiesList.length > 0 && (
                <>
                  {this.bountySection.activitiesList.map(activity => (
                    <ActivityBubble activity={activity} />
                  ))}
                </>
              )}
            </UCard>
            <UCard title="APPLICANTS">
              {this.bountySection.applicantsList && this.bountySection.applicantsList.length > 0 && (
                <>
                  {this.bountySection.applicantsList.map(applicant => (
                    <ApplicantBubble applicant={applicant} />
                  ))}
                </>
              )}
            </UCard>
          </div>
          <div class="basis-1/3">
            <div class="bg-white p-10 rounded-lg border mb-6">
              {this.bountySection.startup && <StartupCard startup={this.bountySection.startup} />}
            </div>
            <UCard title="FOUNDER" class="mb-6">
              {this.bountySection.founder && (
                <PersonalCard
                  profile={this.bountySection.founder}
                  class="mt-20px"
                  keyMap={{
                    skills: 'applicantsSkills',
                    comerId: 'comerID',
                    name: 'name',
                    avatar: 'image',
                    email: 'email',
                    location: 'location',
                    timeZone: 'timeZone'
                  }}
                />
              )}
            </UCard>
            <UCard
              title="APPROVED"
              class="mb-6"
              v-slots={{
                'header-extra': () => (
                  <>
                    {this.bountyContractInfo.role === USER_ROLE.FOUNDER &&
                      this.bountySection.approvedPeople && <Unapprove />}
                  </>
                )
              }}
            >
              {this.bountySection.approvedPeople && (
                <PersonalCard
                  profile={this.bountySection.approvedPeople}
                  class="mt-20px"
                  keyMap={{
                    skills: 'applicantsSkills',
                    comerId: 'comerID',
                    name: 'name',
                    avatar: 'image',
                    email: 'email',
                    location: 'location',
                    timeZone: 'timeZone'
                  }}
                />
              )}
            </UCard>
            <UCard title="DEPOSIT RECORDS">
              {this.bountySection.depositRecords && this.bountySection.depositRecords.length > 0 && (
                <>
                  {this.bountySection.depositRecords.map((item, index) => (
                    <DepositBubble
                      class={`mb-6 ${index === 0 && 'mt-10'}`}
                      depositInfo={item}
                      key={item.name}
                    />
                  ))}
                </>
              )}
            </UCard>
          </div>
        </div>
      </USpin>
    )
  }
})
