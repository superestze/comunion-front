import { UCard, UDeveloping, UBreadcrumb, UBreadcrumbItem } from '@comunion/components'

import { ArrowLeftOutlined, EmptyFilled } from '@comunion/icons'
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
      const { data } = await services['startup@start-team-meabers-list']({
        startupId,
        limit,
        offset: 0
      })
      teamMembers.value.length = 0
      totalTeamMembers.value = data?.total
      if (data!.list.length) {
        teamMembers.value.push(...(data!.list as unknown as StartupItem[]))
      } else {
        teamMembers.value.length = 0
      }
    }

    const getUserIsFollow = async () => {
      const { data } = await services['startup@startup-followed-by-me']({
        startupId
      })
      userIsFollow.value = data!.isFollowed
    }

    const followStartup = async () => {
      await services['startup@startup-follow']({
        startupId
      })
      getUserIsFollow()
    }

    const unfollowStartup = async () => {
      await services['startup@startup-unfollow']({
        startupId
      })
      getUserIsFollow()
    }

    const viewAllMembers = () => {
      teamList(totalTeamMembers.value)
    }

    onMounted(() => {
      getStartup()
      teamList()
      getUserIsFollow()
    })

    return () => (
      <div>
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
        <div class="flex gap-10 mb-20">
          <div class="basis-2/3">
            <div class="bg-white p-10 rounded border mb-10">
              {startup.value && (
                <StartupBasicInfo
                  startup={startup.value}
                  userIsFollow={userIsFollow.value}
                  onFollowStartup={followStartup}
                  onUnfollowStartup={unfollowStartup}
                />
              )}
            </div>
            <UCard title="FINANCE" class="mb-10 h-115">
              <Finance startup={startup.value} />
            </UCard>
            <UCard title="BOUNTIES" class="mb-10">
              <UDeveloping class="my-10">
                <EmptyFilled />
              </UDeveloping>
            </UCard>
            <UCard title="GOVERNANCE">
              <UDeveloping class="my-10">
                <EmptyFilled />
              </UDeveloping>
            </UCard>
          </div>
          <div class="basis-1/3">
            <UCard title="TEAM" class="mb-10">
              <Team
                teamMembers={teamMembers.value}
                memberCount={totalTeamMembers.value}
                onViewAllMembers={viewAllMembers}
              />
            </UCard>
            <UCard title="LAUNCH" class="mb-10">
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
      </div>
    )
  }
})

export default StartupDetailPage
