import { UBreadcrumb, USpin } from '@comunion/components'
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import Bounties from './components/bounties'
import Connection from './components/connection'
import Filter from './components/filter'
import Finance from './components/finance'
import Overview from './components/overview'
import Profile from './components/profile'
import Security from './components/security'

import Team from './components/team'
import { useStartup } from './hooks/useStartup'
import Empty from '@/pages/comer/components/empty'
import { services } from '@/services'

export default defineComponent({
  name: 'startupDetail',
  setup() {
    const loading = ref<boolean>(false)
    const systemTasks = ref<string[]>(['All', 'Bounty', 'Crowdfunding', 'Governance', 'Other dapp'])
    const startup = useStartup()
    const route = useRoute()
    startup.get(route.params.id as string)

    const dataCount = ref({
      bountyCnt: 0,
      crowdfundingCnt: 0,
      proposalCnt: 0,
      otherDappCnt: 0
    })

    services['startup@tartup-businness-data-count']({
      startupID: route.params.id
    }).then(res => {
      if (!res.error) {
        dataCount.value = res.data
      }
    })

    return {
      loading,
      systemTasks,
      startup: startup.detail,
      startupId: route.params.id as string,
      dataCount
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
          {this.startup && <Profile startupId={this.startupId} startup={this.startup} />}
        </div>
        <div class="flex mb-20 gap-6">
          <div class="basis-1/3">
            <Overview content={this.startup?.overview || ''} />
            {(this.startup?.kyc || this.startup?.contractAudit) && (
              <Security
                kyc={this.startup?.kyc || ''}
                contractAudit={this.startup?.contractAudit || ''}
              />
            )}
            <Finance />
            <Team
              members={
                this.startup?.members.map(member => {
                  return {
                    comerAvatar: member.comerProfile?.avatar || '',
                    comerId: member.comerID,
                    comerName: member.comerProfile?.name || '',
                    joinedTime: member.createdAt,
                    position: member.position
                  }
                }) || []
              }
            />
            <Connection follows={this.startup?.follows} />
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
