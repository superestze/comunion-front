import { UBreadcrumb, UBreadcrumbItem, UCard, USpin, UTooltip } from '@comunion/components'
import { ArrowLeftOutlined, PeriodOutlined, StageOutlined, ClockOutlined } from '@comunion/icons'
import dayjs from 'dayjs'
import { defineComponent, computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import BountyCard from './components/BountyCard'
import { ActivityBubble, ApplicantBubble, DepositBubble } from './components/Bubble'
import { Payment } from './components/Payment'
import PersonalCard from './components/PersonalCard'
import PostUpdate from './components/PostUpdate'
import StartupCard from './components/StartupCard'
import { useBountyContractWrapper } from './hooks/useBountyContractWrapper'
import { BOUNTY_STATUS } from '@/constants'
import router from '@/router'
import { useBountyStore } from '@/stores'
import { useBountyContractStore } from '@/stores/bountyContract'
import { getChainInfoByChainId } from '@/utils/etherscan'

export default defineComponent({
  name: 'BountyDetail',
  setup() {
    const route = useRoute()
    const bountyStore = useBountyStore()

    const loading = ref<boolean>(true)

    const initBountyStore = () => {
      bountyStore.initialize(route.query.bountyId as string)
    }
    initBountyStore()
    const bountySection = computed(() => bountyStore.bountySection)
    const bountyContractStore = useBountyContractStore()
    const bountyContract = ref()
    const postUpdate = ref<any>()
    const gap = ref<number>(0)
    const chainInfo = computed(() =>
      getChainInfoByChainId(bountySection.value.detail?.chainID as number)
    )

    const bountyExpired = computed(() => {
      const time = dayjs().utcOffset(0).unix()
      const expiresIn = dayjs.utc(bountyStore.bountySection.detail?.expiresIn || '').unix()
      const notApplicant =
        !bountyStore.bountySection.applicantsList ||
        bountyStore.bountySection.applicantsList.length == 0
      const isExpires = expiresIn > 0 && time > 0 && time >= expiresIn
      if (isExpires && notApplicant) {
        return true
      }
      return false
    })

    let isInit = false
    watch(
      [() => bountySection.value.detail, bountyContractStore.bountyContractInfo],
      ([detail, bountyContractInfo]) => {
        if (detail?.depositContract && !isInit) {
          const BountyContractWrapper = useBountyContractWrapper(route.query.bountyId as string)
          postUpdate.value = BountyContractWrapper.bountyContract.postUpdate
          loading.value = false
          isInit = true
        }
        if (bountyContractInfo.timeLock) {
          gap.value = dayjs(new Date((bountyContractInfo.timeLock || 0) * 1000)).diff(
            dayjs(new Date()),
            'day'
          )
        }
      }
    )
    return {
      initBountyStore,
      bountyContract,
      postUpdate,
      bountySection,
      loading,
      bountyContractInfo: bountyContractStore.bountyContractInfo,
      gap,
      chainInfo,
      bountyExpired
    }
  },
  render() {
    return (
      <USpin show={this.loading}>
        <UBreadcrumb class="mt-10 mb-10">
          <UBreadcrumbItem v-slots={{ separator: () => <ArrowLeftOutlined /> }} />
          <UBreadcrumbItem>
            <span class="cursor-pointer text-primary uppercase u-label2" onClick={router.back}>
              BACK
            </span>
          </UBreadcrumbItem>
        </UBreadcrumb>
        <div class="flex mb-20 gap-6">
          <div class="basis-2/3">
            <div class="bg-white border rounded-lg mb-6 p-10">
              {this.bountySection.detail && (
                <BountyCard
                  bountyExpired={this.bountyExpired}
                  bountyDetail={this.bountySection.detail}
                />
              )}
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
                          <p class="flex ml-14px text-14px items-center">PERIOD: STAGE</p>
                        </>
                      ) : (
                        <>
                          <PeriodOutlined class="ml-26px" />
                          <p class="flex ml-14px text-14px items-center">PERIOD: WEEK</p>
                        </>
                      )}
                    </p>
                    <div class="flex font-opensans bg-[rgba(83,49,244,0.06)] rounded-35px h-34px items-center justify-center">
                      <span class="flex rounded-4xl leading-snug ml-8px py-1 px-4 text-primary1 text-16px items-center">
                        <img src={this.chainInfo?.logo} class="h-5 w-5" />{' '}
                        <span class="font-opensans ml-2">{this.chainInfo?.name}</span>
                      </span>
                    </div>
                  </div>
                )
              }}
            >
              {this.bountySection.bountyPayment && (
                <Payment
                  detailChainId={this.bountySection.detail?.chainID || 0}
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
                                  Post an update at least every 5 days, otherwise you will lose the
                                  permission to lock the deposit, and the founder can unlock.
                                </div>
                              )
                            }}
                          </UTooltip>
                          {this.gap >= 0 ? (
                            <p class="flex mr-4 text-grey3 items-center u-body3">
                              Founder can unlock after{' '}
                              <span class="mx-1 text-parimary">{this.gap}</span> days
                            </p>
                          ) : (
                            <p class="flex text-error mr-4 items-center u-body3">
                              Founder can already unlock deposits
                            </p>
                          )}
                        </>
                      )}
                      <PostUpdate postUpdate={this.postUpdate} />
                    </div>
                  )
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
                    <ApplicantBubble
                      detailChainId={this.bountySection.detail?.chainID || 0}
                      applicant={applicant}
                    />
                  ))}
                </>
              )}
            </UCard>
          </div>
          <div class="basis-1/3">
            <div class="bg-white border rounded-lg mb-6 p-10">
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
              // v-slots={{
              //   'header-extra': () => (
              //     <>
              //       {this.bountyContractInfo.role === USER_ROLE.FOUNDER &&
              //         (this.bountySection.approvedPeople?.comerID || 0) > 0 && <Unapprove />}
              //     </>
              //   )
              // }}
            >
              {(this.bountySection.approvedPeople?.comerID || 0) > 0 && (
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
