import {
  UCard,
  UDeveloping,
  UBreadcrumb,
  UBreadcrumbItem,
  USpin,
  UScrollList,
  UNoContent
} from '@comunion/components'
import { ArrowLeftOutlined, EmptyFilled } from '@comunion/icons'
import { defineComponent, onMounted, ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BountiesCard from './components/Bounties'
import { Finance } from './components/Finance'
import { StartupBasicInfo } from './components/StartupBasicInfo'
import { Team } from './components/Teams'
import { services } from '@/services'
import { StartupItem } from '@/types'

const StartupDetailPage = defineComponent({
  name: 'StartupDetailPage',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const startupId = route.query.startupId
    const startup = ref<StartupItem>()
    const teamMembers = ref<StartupItem[]>([])
    const totalTeamMembers = ref()
    const userIsFollow = ref(false)
    const pageLoading = ref(false)
    const pagination = reactive<{
      pageSize: number
      total: number
      page: number
      loading: boolean
    }>({
      pageSize: 4,
      total: 0,
      page: 1,
      loading: false
    })

    const getStartup = async () => {
      if (startupId) {
        const { error, data } = await services['startup@startup-get']({
          startupId
        })
        if (!error) {
          startup.value = data
        }
      }
    }

    const teamList = async (limit = 5) => {
      const { error, data } = await services['startup@start-team-meabers-list']({
        startupId,
        limit,
        offset: 0
      })
      if (!error) {
        teamMembers.value.length = 0
        totalTeamMembers.value = data?.total
        if (data!.list.length) {
          teamMembers.value.push(...(data!.list as unknown as StartupItem[]))
        } else {
          teamMembers.value.length = 0
        }
      }
    }

    const getUserIsFollow = async () => {
      const { error, data } = await services['startup@startup-followed-by-me']({
        startupId
      })
      if (!error) {
        userIsFollow.value = data!.isFollowed
      }
    }

    const toggleFollowStartup = async (type: string) => {
      pageLoading.value = true
      const { error } = await services[
        type === 'follow' ? 'startup@startup-follow' : 'startup@startup-unfollow'
      ]({
        startupId
      })
      if (!error) {
        await getUserIsFollow()
      }
      pageLoading.value = false
    }

    const viewAllMembers = () => {
      teamList(totalTeamMembers.value)
    }

    const myCreatedStartups = ref<StartupItem[]>([])

    const getCreatedStartups = async () => {
      const { error, data } = await services['startup@startup-list-me']({
        limit: pagination.pageSize,
        offset: pagination.pageSize * (pagination.page - 1)
      })
      if (!error) {
        myCreatedStartups.value.push(...(data!.list as unknown as StartupItem[]))
        pagination.total = data!.total
      }
    }

    const onLoadMore = async (p: number) => {
      pagination.loading = true
      pagination.page = p
      await getCreatedStartups()
      pagination.loading = false
    }

    onMounted(() => {
      getStartup()
      teamList()
      getUserIsFollow()
      getCreatedStartups()
    })

    return () => (
      <USpin show={pageLoading.value}>
        {/* <template v-slot="description">123kkj</template> */}
        <UBreadcrumb class="mb-10 mt-10">
          <UBreadcrumbItem v-slots={{ separator: () => <ArrowLeftOutlined /> }} />
          <UBreadcrumbItem>
            <span
              class="u-label2 cursor-pointer uppercase text-primary"
              onClick={() => {
                router.back()
              }}
            >
              Back
            </span>
          </UBreadcrumbItem>
        </UBreadcrumb>
        <div class="flex gap-6 mb-20">
          <div class="basis-2/3">
            <div class="bg-white p-10 rounded-lg border mb-6">
              {startup.value && (
                <StartupBasicInfo
                  startup={startup.value}
                  userIsFollow={userIsFollow.value}
                  onFollowStartup={() => toggleFollowStartup('follow')}
                  onUnfollowStartup={() => toggleFollowStartup('unfollow')}
                />
              )}
            </div>
            <UCard title="FINANCE" class="mb-6 !pb-8">
              <Finance startup={startup.value} />
            </UCard>
            <UCard title="BOUNTIES" class="mb-6">
              {/* <UDeveloping class="my-10">
                <EmptyFilled />
              </UDeveloping> */}
              <UScrollList
                triggered={pagination.loading}
                page={pagination.page}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onLoadMore={onLoadMore}
              >
                {myCreatedStartups.value.length ? (
                  myCreatedStartups.value.map((startup, i) => (
                    <BountiesCard startup={startup} key={i} />
                  ))
                ) : (
                  <UNoContent textTip="TO BE EMPTY" class="my-10">
                    <EmptyFilled />
                  </UNoContent>
                )}
              </UScrollList>
            </UCard>
            <UCard title="GOVERNANCE">
              <UDeveloping class="my-10">
                <EmptyFilled />
              </UDeveloping>
            </UCard>
          </div>
          <div class="basis-1/3">
            <UCard title="TEAM" class="mb-6">
              <Team
                teamMembers={teamMembers.value}
                memberCount={totalTeamMembers.value}
                onViewAllMembers={viewAllMembers}
              />
            </UCard>
            <UCard title="LAUNCH" class="mb-6">
              <UDeveloping class="my-10">
                <EmptyFilled />
              </UDeveloping>
            </UCard>
            <UCard title="SWAP">
              <UDeveloping class="my-10">
                <EmptyFilled />
              </UDeveloping>
            </UCard>
          </div>
        </div>
      </USpin>
    )
  }
})

export default StartupDetailPage
