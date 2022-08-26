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

export default defineComponent({
  setup() {
    const route = useRoute()
    const { id } = route.query
    console.log(id)
    const instance = useProfile(id as string)
    console.log(instance.view)

    instance.getProfileData()

    const createdByMe = ref<boolean>(false)
    const systemTasks = ref<string[]>(['All', 'Startup', 'Bounty', 'Crowdfunding', 'Proposal'])
    const selectedTasks = ref<string[]>(['All'])

    const moduleTag = useModuleTag()

    const nothingToShow = computed(() => {
      return (
        moduleTag.tagCount.bountyCnt === 0 &&
        moduleTag.tagCount.crowdfundingCnt === 0 &&
        moduleTag.tagCount.proposalCnt === 0 &&
        moduleTag.tagCount.startupCnt === 0
      )
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

    return (
      <USpin show={this.loading}>
        <div class="mt-50px text-primary mb-10 u-h2">My Dashboard</div>
        <div class="flex gap-6 mb-20">
          <div class="basis-1/3">
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
                />
                <Bio content={this.profile?.bio} view={this.view} onDone={this.get} />
                <Social view={this.view} />
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
          <div class="basis-2/3">
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
                        return <Startup createdByMe={this.createdByMe} />
                      } else if (
                        task === 'Bounty' &&
                        rowDisplay('Bounty') &&
                        this.tagCount.bountyCnt
                      ) {
                        return <Bounty createdByMe={this.createdByMe} />
                      } else if (
                        task === 'Crowdfunding' &&
                        rowDisplay('Crowdfunding') &&
                        this.tagCount.crowdfundingCnt
                      ) {
                        return <Crowdfunding createdByMe={this.createdByMe} />
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
