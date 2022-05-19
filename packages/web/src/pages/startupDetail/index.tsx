import { UCard } from '@comunion/components'
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { StartupBasicInfo } from './components/StartupBasicInfo'
import Breadcrumb from '@/components/Breadcrumb'
import { services } from '@/services'
import { StartupItem } from '@/types'

const StartupDetailPage = defineComponent({
  name: 'StartupDetailPage',
  setup() {
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
      <div>
        <Breadcrumb />
        <div class="flex gap-10 mb-20">
          <div class="basis-2/3">
            <div class="bg-white p-10 rounded border mb-10">
              {startup.value && <StartupBasicInfo startup={startup.value} />}
            </div>
            <UCard title="FINANCE" class="mb-10"></UCard>
            <UCard title="BOUNTIES" class="mb-10"></UCard>
            <UCard title="GOVERNANCE"></UCard>
          </div>
          <div class="basis-1/3">
            <UCard title="TEAM" class="mb-10"></UCard>
            <UCard title="LAUNCH" class="mb-10"></UCard>
            <UCard title="SWAP"></UCard>
          </div>
        </div>
      </div>
    )
  }
})

export default StartupDetailPage
