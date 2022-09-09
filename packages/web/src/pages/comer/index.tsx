import { USpin } from '@comunion/components'
import { defineComponent, ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Bio from './components/bio'
import Bounty from './components/bounty'
import Comer from './components/comer'
import Connection from './components/connection'
import Crowdfunding from './components/crowdfunding'
import Education from './components/education'
import Empty from './components/empty'
import Filter from './components/filter'
import Language from './components/language'
import Proposal from './components/proposal'
import Skill from './components/skill'
import Social from './components/social'
import Startup from './components/startup'
import { useModuleTag } from './hooks/useModuleTag'
import { useProfile } from './hooks/useProfile'
import { ComerAccount } from '@/components/OAuth/Link/OAuthLinkWidget'

const keyValue: Record<string, string> = {
  Startup: 'startupCnt',
  Bounty: 'bountyCnt',
  Crowdfunding: 'crowdfundingCnt',
  Proposal: 'proposalCnt'
}

export default defineComponent({
  setup() {
    const route = useRoute()
    const { id } = route.query
    console.log(id)
    const instance = useProfile(id as string)
    console.log(instance.view)

    instance.getProfileData()

    const createdByMe = ref<boolean>(false)
    const systemTasks = ref<string[]>(['All', 'Startup', 'Bounty', 'dCrowdfunding', 'Proposal'])
    const selectedTasks = ref<string[]>(['All'])

    const moduleTag = useModuleTag()

    const nothingToShow = computed(() => {
      const all = selectedTasks.value.find(value => value === 'All')
      if (all) {
        return (
          moduleTag.tagCount.bountyCnt === 0 &&
          moduleTag.tagCount.crowdfundingCnt === 0 &&
          moduleTag.tagCount.proposalCnt === 0 &&
          moduleTag.tagCount.startupCnt === 0
        )
      }
      console.log(selectedTasks.value)
      const result = selectedTasks.value
        .map(value => {
          return moduleTag.tagCount[keyValue[value]]
        })
        .reduce((pre: any, next) => {
          if (typeof pre === 'number') {
            return pre === 0 && next === 0
          }
          return pre && next === 0
        })
      return typeof result === 'number' ? result === 0 : result
    })

    watch(
      () => [createdByMe.value, instance.profile.value?.comerID],
      ([createdByMe, comerId]) => {
        if (comerId) {
          moduleTag.getData(comerId as number, createdByMe ? 1 : 2)
        }
      },
      { immediate: true }
    )

    return {
      profile: instance.profile,
      systemTasks,
      createdByMe,
      selectedTasks,
      view: instance.view,
      get: instance.getProfileData,
      tagCount: moduleTag.tagCount,
      nothingToShow,
      getData: moduleTag.getData,
      loading: instance.loading
    }
  },
  render() {
    const handleTabChange = (createdByMe: boolean) => {
      this.createdByMe = createdByMe
    }

    const handleSelectedTagChange = (arr: string[]) => {
      this.selectedTasks = arr
    }

    const rowDisplay = (key: string) => {
      if (this.selectedTasks.findIndex((task: string) => task === 'All') > -1) {
        return true
      }
      return this.selectedTasks.findIndex((task: string) => task === key) > -1
    }
    console.log('profile', this.profile)
    return (
      <USpin show={this.loading}>
        <div class="mt-50px text-primary mb-10 u-h2"></div>
        <div class="flex mb-20 gap-6">
          <div class="overflow-hidden basis-1/3">
            {this.profile && (
              <>
                <Comer
                  avatar={this.profile?.avatar}
                  name={this.profile?.name}
                  location={this.profile?.location}
                  timeZone={this.profile?.timeZone}
                  cover={this.profile?.cover}
                  view={this.view}
                  onDone={this.get}
                  comerAccounts={this.profile?.comerAccounts as ComerAccount[]}
                />
                <Bio content={this.profile?.bio} view={this.view} onDone={this.get} />
                <Social view={this.view} profile={this.profile} onDone={this.get} />
                <Skill
                  skills={(this.profile?.skills || []).map(item => item.name) as string[]}
                  view={this.view}
                  onDone={this.get}
                />
                <Language
                  view={this.view}
                  list={this.profile?.languages as any}
                  onDone={this.get}
                />
                <Education
                  view={this.view}
                  list={this.profile?.educations as any}
                  onDone={this.get}
                />
                <Connection view={this.view} comerId={this.profile.comerID as number} />
              </>
            )}
          </div>
          <div class="overflow-hidden basis-2/3">
            {this.profile && (
              <>
                <Filter
                  tasks={this.systemTasks}
                  onTabChange={handleTabChange}
                  onSelectedTagChange={handleSelectedTagChange}
                />
                {this.nothingToShow ? (
                  <Empty />
                ) : (
                  <>
                    {this.systemTasks.map(task => {
                      if (task === 'Startup' && rowDisplay('Startup') && this.tagCount.startupCnt) {
                        return (
                          <Startup
                            createdByMe={this.createdByMe}
                            comerId={this.profile.comerID as number}
                            view={this.view}
                          />
                        )
                      } else if (
                        task === 'Bounty' &&
                        rowDisplay('Bounty') &&
                        this.tagCount.bountyCnt
                      ) {
                        return (
                          <Bounty
                            createdByMe={this.createdByMe}
                            comerId={this.profile.comerID as number}
                          />
                        )
                      } else if (
                        task === 'dCrowdfunding' &&
                        rowDisplay('dCrowdfunding') &&
                        this.tagCount.crowdfundingCnt
                      ) {
                        return (
                          <Crowdfunding
                            createdByMe={this.createdByMe}
                            comerId={this.profile.comerID as number}
                          />
                        )
                      } else if (
                        task === 'Proposal' &&
                        rowDisplay('Proposal') &&
                        this.tagCount.proposalCnt
                      ) {
                        return <Proposal createdByMe={this.createdByMe} />
                      } else {
                        return
                      }
                    })}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </USpin>
    )
  }
})
