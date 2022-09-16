import { UBreadcrumb, USpin } from '@comunion/components'
import { defineComponent, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Bounties from './components/bounties'
import Connection from './components/connection'
import Crowdfunding from './components/crowdfunding'
import Filter from './components/filter'
import Finance from './components/finance'
import Governance from './components/governance'
import Overview from './components/overview'
import Profile from './components/profile'
import Security from './components/security'

import Team from './components/team'
import { useStartup } from './hooks/useStartup'
import Empty from '@/pages/comer/components/empty'
import { services } from '@/services'
// type DataType = NonNullable<ServiceReturn<'startup@tartup-businness-data-count'>>

export default defineComponent({
  name: 'startupDetail',
  setup() {
    const loading = ref<boolean>(false)
    const startup = useStartup()
    const route = useRoute()
    startup.get(route.params.id as string)

    const dataCount = ref<any>({
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

    const selectedTags = ref<string[]>([])

    const TAG_LABEL_MAP: any = {
      Bounty: 'bountyCnt',
      dCrowdfunding: 'crowdfundingCnt',
      Governance: 'proposalCnt',
      'Other dapp': 'otherDappCnt'
    }
    const countKeys = Object.keys(dataCount.value)

    const canShowByTagName = (tagName: string) => {
      const tags = selectedTags.value
      if (!tags.length || tags.indexOf('All') > -1 || tags.indexOf(tagName) > -1) {
        const label = TAG_LABEL_MAP[tagName]
        if (label) {
          return dataCount.value[label] > 0
        } else {
          return false
        }
      }
      return false
    }

    const hasDataToShow = computed(() => {
      const tags = selectedTags.value
      if (!tags.length || tags.indexOf('All') > -1) {
        return !!countKeys.filter(key => {
          return dataCount.value[key] > 0
        }).length
      } else {
        return !!tags.filter(tag => {
          const label = TAG_LABEL_MAP[tag]
          if (label) {
            return dataCount.value[label] > 0
          } else {
            return false
          }
        }).length
      }
    })

    return {
      loading,
      startup: startup.detail,
      startupId: route.params.id as string,
      dataCount,
      selectedTags,
      hasDataToShow,
      canShowByTagName
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
          <div class="overflow-hidden basis-1/3">
            <Overview content={this.startup?.overview || ''} />
            <Team startupId={this.startupId} />
            {(this.startup?.kyc || this.startup?.contractAudit) && (
              <Security
                kyc={this.startup?.kyc || ''}
                contractAudit={this.startup?.contractAudit || ''}
              />
            )}
            <Finance startup={this.startup} />
            <Connection startupId={this.startupId} />
          </div>
          <div class="overflow-hidden basis-2/3">
            <Filter
              tabSequence={this.startup?.tabSequence}
              onSelectedTagChange={tags => (this.selectedTags = tags)}
            />
            {this.canShowByTagName('Bounty') && <Bounties startupId={this.startupId} />}
            {this.canShowByTagName('dCrowdfunding') && <Crowdfunding startupId={this.startupId} />}
            {this.canShowByTagName('Governance') && <Governance startupId={this.startupId} />}
            {!this.hasDataToShow && <Empty />}
          </div>
        </div>
      </USpin>
    )
  }
})
