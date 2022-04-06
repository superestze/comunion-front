import { defineComponent } from 'vue'
import StartupSetting from './components/StartupSetting'
import TeamSetting from './components/TeamSetting'

const StartupSetPage = defineComponent({
  name: 'StartupSetPage',
  setup(props, context) {
    return () => (
      <div class="startup-set grid grid-cols-[1fr,0.52fr] grid-rows-1 gap-x-[40px] mb-38">
        <div class="startup bg-white p-10">
          <StartupSetting />
        </div>
        <div class="team bg-white p-10">
          <TeamSetting />
        </div>
      </div>
    )
  }
})

export default StartupSetPage
