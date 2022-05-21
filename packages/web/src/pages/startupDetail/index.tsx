import { UCard, UDeveloping } from '@comunion/components'
import { EmptyFilled } from '@comunion/icons'
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Finance } from './components/Finance'
import { StartupBasicInfo } from './components/StartupBasicInfo'
import { Team } from './components/Teams'
import Breadcrumb from '@/components/Breadcrumb'
import { services } from '@/services'
import { StartupItem } from '@/types'

const StartupDetailPage = defineComponent({
  name: 'StartupDetailPage',
  setup() {
    const route = useRoute()
    const startupId = route.query.startupId
    const startup = ref<StartupItem>()
    const teamMembers = ref<StartupItem[]>([])

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

    const teamList = async () => {
      const { data } = await services['startup@start-team-meabers-list']({
        startupId,
        limit: 5,
        offset: 0
      })
      teamMembers.value.length = 0
      if (data!.list.length) {
        teamMembers.value.push(...(data!.list as unknown as StartupItem[]))
      } else {
        teamMembers.value.length = 0
      }
    }

    onMounted(() => {
      getStartup()
      teamList()
    })

    return () => (
      <div>
        <Breadcrumb />
        <div class="flex gap-10 mb-20">
          <div class="basis-2/3">
            <div class="bg-white p-10 rounded border mb-10">
              {startup.value && <StartupBasicInfo startup={startup.value} />}
            </div>
            <UCard title="FINANCE" class="mb-10">
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
              <Team teamMembers={teamMembers.value} memberCount={startup.value?.memberCount} />
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
