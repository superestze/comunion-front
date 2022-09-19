import { UBreadcrumb, UCard, USpin, UTooltip } from '@comunion/components'
import { PeriodOutlined, StageOutlined, ClockOutlined } from '@comunion/icons'
import dayjs from 'dayjs'
import { pluralize } from 'inflected'
import { defineComponent, computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BountyDetailCard from './components/BountyDetailCard'
import { ActivityBubble, ApplicantBubble, DepositBubble } from './components/Bubble'
import Payment from './components/Payment'
import PersonalCard from './components/PersonalCard'
import PostUpdate from './components/PostUpdate'
import StartupCard from './components/StartupCard'
import { useBountyContractWrapper } from './hooks/useBountyContractWrapper'
import { BOUNTY_STATUS, PERIOD_OPTIONS, USER_ROLE } from '@/constants'
import { services } from '@/services'
import { useBountyStore, useWalletStore } from '@/stores'
import { useBountyContractStore } from '@/stores/bountyContract'
import { getChainInfoByChainId } from '@/utils/etherscan'

export default defineComponent({
  name: 'BountyDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const bountyStore = useBountyStore()
    const walletStore = useWalletStore()

    const loading = ref<boolean>(false)

    bountyStore.initialize(route.params.id as string)
    const bountySection = computed(() => {
      return bountyStore.bountySection
    })
    const bountyContractStore = useBountyContractStore()
    const bountyContract = ref()
    const postUpdate = ref<any>()
    const gapValue = ref<number>(0)
    const gapUnit = ref<string>('day')
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

    // Need to get the chain id of the current bounty, because there is a problem with store caching
    services['bounty@bounty-get-detail']({ bountyID: route.params.id }).then(res => {
      const { error, data } = res
      if (!error) {
        if (data.chainID != walletStore.chainId) {
          router.push('/bounty/list')
        }
      }
    })

    let isInit = false
    watch(
      [() => bountySection.value.detail, bountyContractStore.bountyContractInfo],
      ([detail, bountyContractInfo]) => {
        if (detail?.depositContract && !isInit) {
          const BountyContractWrapper = useBountyContractWrapper(route.params.id as string)
          postUpdate.value = BountyContractWrapper.bountyContract.postUpdate
          loading.value = false
          isInit = true
        }
        if (bountyContractInfo.timeLock) {
          const days = dayjs(new Date((bountyContractInfo.timeLock || 0) * 1000)).diff(
            dayjs(new Date()),
            'day'
          )
          if (days > 0) {
            gapUnit.value = 'day'
            gapValue.value = days
          } else {
            gapUnit.value = 'hour'
            gapValue.value = dayjs(new Date((bountyContractInfo.timeLock || 0) * 1000)).diff(
              dayjs(new Date()),
              'hour'
            )
          }
        }
      }
    )
    return {
      bountyContract,
      postUpdate,
      bountySection,
      loading,
      bountyContractInfo: bountyContractStore.bountyContractInfo,
      gapValue,
      gapUnit,
      chainInfo,
      bountyExpired
    }
  },
  render() {
    const getPeriodByType = (type: number) => {
      const targetIndex = PERIOD_OPTIONS.findIndex(opt => opt.value === type)
      if (targetIndex !== -1) {
        return PERIOD_OPTIONS[targetIndex].type.toUpperCase()
      }
      return ''
    }

    return (
      <USpin show={this.loading}>
        <UBreadcrumb class="mt-10 mb-10">
          {/* <UBreadcrumbItem>
            <span
              class="cursor-pointer flex text-primary items-center u-label2"
              onClick={() => {
                this.$router.go(-1)
              }}
            >
              <ArrowLeftOutlined />
              <span class="ml-1">BACK</span>
            </span>
          </UBreadcrumbItem> */}
        </UBreadcrumb>

        <div class="flex mb-20 gap-6">
          <div class="overflow-hidden basis-2/3">
            <div class="bg-white border rounded-sm mb-6 p-6">
              {this.bountySection.detail && (
                <BountyDetailCard
                  bountyExpired={this.bountyExpired}
                  bountyDetail={this.bountySection.detail}
                />
              )}
            </div>
            <UCard
              title="payment"
              class="mb-6"
              v-slots={{
                header: () => (
                  <div class="flex justify-between">
                    <p class="flex items-center">
                      <span class="mr-6 text-color2 u-h5">Payment</span>
                      {this.bountySection.bountyPayment?.bountyPaymentInfo?.paymentMode === 1 ? (
                        <>
                          <StageOutlined class="h-4 w-4" />
                          <p class="font-medium text-primary ml-2">Stage</p>
                        </>
                      ) : (
                        <>
                          <PeriodOutlined class="h-4 text-primary w-4" />
                          <p class="font-medium text-primary ml-2">
                            Period:{' '}
                            {getPeriodByType(
                              this.bountySection.bountyPayment?.periodTerms?.periodType || 1
                            )}
                          </p>
                        </>
                      )}
                    </p>
                    <div class="flex items-center">
                      <img src={this.chainInfo?.logo} class="h-4 w-4" />{' '}
                      <span class="font-thin font-primary ml-2 tracking-normal text-color2">
                        {this.chainInfo?.name}
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
              title="Activities"
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
                                    this.gapValue >= 0 ? 'text-grey4' : 'text-error'
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
                          {/* just applicant show countdown tips */}
                          {this.bountyContractInfo.role !== USER_ROLE.FOUNDER &&
                            (this.gapValue >= 0 ? (
                              <p class="flex mr-4 text-grey3 items-center ">
                                Founder can unlock after
                                <span class="mx-1 text-primary">{this.gapValue}</span>
                                {this.gapValue > 1 ? `${pluralize(this.gapUnit)}` : this.gapUnit}
                              </p>
                            ) : (
                              <p class="flex text-error mr-4 items-center">
                                Founder can already unlock deposits
                              </p>
                            ))}
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
            <UCard title="Applicants">
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
          <div class="overflow-hidden basis-1/3">
            <div class="bg-white border rounded-sm mb-6 p-6">
              {this.bountySection.startup && <StartupCard startup={this.bountySection.startup} />}
            </div>
            <UCard title="Founder" class="mb-6">
              {this.bountySection.founder && (
                <PersonalCard
                  profile={this.bountySection.founder}
                  class="mt-5"
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
              title="Approved"
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
                  class="mt-5"
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
            <UCard title="Deposit records">
              {this.bountySection.depositRecords && this.bountySection.depositRecords.length > 0 && (
                <>
                  {this.bountySection.depositRecords.map((item, index) => (
                    <DepositBubble
                      class={`mb-4 ${index === 0 && 'mt-6'}`}
                      depositInfo={item}
                      key={item.name}
                      tokenSymbol={this.bountyContractInfo.depositTokenSymbol}
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
