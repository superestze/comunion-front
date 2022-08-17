import { defineComponent, computed, ref } from 'vue'
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
import { useProfileStore } from '@/stores/profile'

export default defineComponent({
  setup() {
    const profileStore = useProfileStore()
    profileStore.get()
    const profile = computed(() => profileStore.value)

    const route = useRoute()

    const { view } = route.query

    console.log(view)

    const createdByMe = ref<boolean>(false)
    const systemTasks = ref<string[]>(['All', 'Startup', 'Bounty', 'Crowdfunding', 'Proposal'])
    const selectedTasks = ref<string[]>(['All'])
    return {
      profile,
      systemTasks,
      createdByMe,
      selectedTasks,
      view
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
      <div>
        <div class="mt-50px text-primary mb-10 u-h2">My Dashboard</div>
        <div class="flex gap-6 mb-20">
          <div class="basis-1/3">
            <Comer
              avatar={this.profile?.avatar}
              name={this.profile?.name}
              location={this.profile?.location}
              timeZone={this.profile?.timeZone}
              view={!!this.view}
            />
            <Bio content={this.profile?.bio} view={!!this.view} />
            <Social view={!!this.view} />
            <Skill
              skills={(this.profile?.skills || []).map(item => item.name) as string[]}
              view={!!this.view}
            />
            <Language view={!!this.view} />
            <Education view={!!this.view} />
            <Connection view={!!this.view} />
          </div>
          <div class="basis-2/3">
            <Filter
              tasks={this.systemTasks}
              onTabChange={handleTabChange}
              onSelectedTagChange={handleSelectedTagChange}
            />
            {this.systemTasks.map(task => {
              if (task === 'Startup' && rowDisplay('Startup')) {
                return <Startup createdByMe={this.createdByMe} />
              } else if (task === 'Bounty' && rowDisplay('Bounty')) {
                return <Bounty createdByMe={this.createdByMe} />
              } else if (task === 'Crowdfunding' && rowDisplay('Crowdfunding')) {
                return <Crowdfunding createdByMe={this.createdByMe} />
              } else if (task === 'Proposal' && rowDisplay('Proposal')) {
                return <Proposal createdByMe={this.createdByMe} />
              } else {
                return
              }
            })}
            <Empty />
          </div>
        </div>
      </div>
    )
  }
})
