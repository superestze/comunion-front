import { defineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EditForm from './components/EditForm'
import Breadcrumb from '@/components/Breadcrumb'
import { services } from '@/services'
import { StartupItem } from '@/types'

const financeSetPage = defineComponent({
  name: 'financeSetPage',
  setup(props, context) {
    const route = useRoute()
    const router = useRouter()
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
    const onCancel = () => {
      router.push({ path: '/comer' })
    }

    onMounted(() => {
      getStartup()
    })

    return () => (
      <>
        <Breadcrumb />
        <div class="startup-set grid grid-rows-1 gap-x-[40px] mb-38">
          <div class="startup bg-white p-10">
            {startup.value && <EditForm startup={startup.value} onCancel={onCancel} />}
          </div>
        </div>
      </>
    )
  }
})

export default financeSetPage
