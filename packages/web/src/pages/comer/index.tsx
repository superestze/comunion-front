import { defineComponent, computed, ref } from 'vue'
import Bio from './components/bio'
import Comer from './components/comer'
import Connection from './components/connection'
import Education from './components/education'
import Filter from './components/filter'
import Language from './components/language'
import Skill from './components/skill'
import Social from './components/social'
import { useProfileStore } from '@/stores/profile'

export default defineComponent({
  setup() {
    const profileStore = useProfileStore()
    profileStore.get()
    const profile = computed(() => profileStore.value)

    const systemTasks = ref<string[]>(['Startup', 'Bounty', 'Crowdfunding', 'Proposal'])
    return {
      profile,
      systemTasks
    }
  },
  render() {
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
            />
            <Bio content={this.profile?.bio} />
            <Social />
            <Skill />
            <Language />
            <Education />
            <Connection />
          </div>
          <div class="basis-2/3">
            <Filter tasks={this.systemTasks} />
            {this.systemTasks.map(task => {
              if (task === 'Startup') {
                return <h1>Startup</h1>
              } else if (task === 'Bounty') {
                return <h1>Bounty</h1>
              } else if (task === 'Crowdfunding') {
                return <h1>Crowdfunding</h1>
              } else if (task === 'Proposal') {
                return <h1>Proposal</h1>
              } else {
                return <h1>error</h1>
              }
            })}
          </div>
        </div>
        <div class="flex mb-20">
          <div class="flex-1 mr-6">
            {/* <Bounties
              class="bg-white border-lg border-1 border-grey5 h-301 h-auto box-border mt-6"
              userHasStartup={userHasStartup.value}
            /> */}
          </div>
          <div class="flex-1">
            {/* <Startups class="bg-white border-lg border-1 border-grey5 h-155 box-border " /> */}
            {/* <Bookmarks
              class="bg-white border-lg border-1 border-grey5 h-155 box-border mt-6"
              userHasStartup={userHasStartup.value}
            />
            <Proposals class="bg-white border-lg border-1 border-grey5 h-155 box-border mb-4 mt-6" /> */}
          </div>
        </div>
      </div>
    )
  }
})
