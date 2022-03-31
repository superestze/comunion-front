import { UCard, UDeveloping, UTabPane, UTabs } from '@comunion/components'
import { defineComponent, onMounted, ref } from 'vue'
import StartupCard from './StartupCard'
import { services } from '@/services'

const Startups = defineComponent({
  name: 'Startups',
  setup(prop, ctx) {
    const myCreatedStartups = ref([])
    const getCreatedStartups = async (page = 1, pageSize = 4) => {
      const { error, data } = await services['startup@startup-list-me']({
        limit: pageSize,
        offset: pageSize * (page - 1)
      })
      if (!error) {
        myCreatedStartups.value = data.list
      }
    }

    onMounted(() => {
      getCreatedStartups()
    })

    return () => (
      <UCard title="MY COMEUPS" size="small" class="p-10 font-700 font-4 leading-6 tracking-2px">
        <UTabs>
          <UTabPane name="WHAT I PARTICIPATED" tab="WHAT I PARTICIPATED">
            <UDeveloping />
          </UTabPane>
          <UTabPane name="INITIATED BY ME" tab="INITIATED BY ME">
            {myCreatedStartups.value.length ? (
              myCreatedStartups.value.map(startup => <StartupCard startup={startup} />)
            ) : (
              <UDeveloping />
            )}
          </UTabPane>
        </UTabs>
      </UCard>
    )
  }
})

export default Startups
