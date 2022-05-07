import { defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import StartupSetting from './components/StartupSetting'
import TeamSetting from './components/TeamSetting'
import Breadcrumb from '@/components/Breadcrumb'
import { services } from '@/services'
import { StartupItem } from '@/types'

const StartupSetPage = defineComponent({
  name: 'StartupSetPage',
  setup(props, context) {
    const route = useRoute()
    const startupId = route.query.startupId
    const startup = ref<StartupItem>()

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

    onMounted(() => {
      getStartup()
    })

    return () => (
      <>
        <Breadcrumb />
        <div class="startup-set grid grid-cols-[1fr,0.52fr] grid-rows-1 gap-x-[40px] mb-38">
          <div class="startup">{startup.value && <StartupSetting startup={startup.value} />}</div>
          <div class="team bg-white p-10">
            {startup.value && <TeamSetting startup={startup.value} />}
          </div>
        </div>
      </>
    )
  }
})

export default StartupSetPage
