import { UBreadcrumb, USpin } from '@comunion/components'
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import Bounties from './components/bounties'
import Connection from './components/connection'
import Filter from './components/filter'
import Finance from './components/finance'
import Overview from './components/overview'
import Profile from './components/profile'
import Team from './components/team'
import { useStartup } from './hooks/useStartup'
import Empty from '@/pages/comer/components/empty'

export default defineComponent({
  setup() {
    const loading = ref<boolean>(false)
    const systemTasks = ref<string[]>(['All', 'Bounty', 'Crowdfunding', 'Governance', 'Other dapp'])
    const startup = useStartup()
    const route = useRoute()
    startup.get(route.params.id as string)
    return {
      loading,
      systemTasks,
      startup: startup.detail,
      startupId: route.params.id as string
    }
  },
  render() {
    return (
      <USpin show={this.loading}>
        <UBreadcrumb class="mt-10 mb-10">
          {/* <UBreadcrumbItem v-slots={{ separator: () => <ArrowLeftOutlined /> }}></UBreadcrumbItem>
          <UBreadcrumbItem v-slots={{ separator: () => <ArrowLeftOutlined /> }}>
            <span
              class="cursor-pointer text-primary uppercase u-label2"
              onClick={() => {
                this.$router.go(-1)
              }}
            >
              BACK
            </span>
          </UBreadcrumbItem> */}
        </UBreadcrumb>
        <div class="w-full">
          <Profile
            startupId={this.startupId}
            name={this.startup?.name || ''}
            mode={this.startup?.mode || 0}
            mission={this.startup?.mission || ''}
          />
        </div>
        <div class="flex mb-20 gap-6">
          <div class="basis-1/3">
            <Overview content={this.startup?.overview || ''} />
            <Finance />
            <Team />
            <Connection />
          </div>
          <div class="basis-2/3">
            <Filter tasks={this.systemTasks} />
            <Bounties startupId={this.startupId} />
            <Empty />
          </div>
        </div>
      </USpin>
    )
  }
})
