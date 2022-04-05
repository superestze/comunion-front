import { UCard, UDeveloping, UTabPane, UTabs } from '@comunion/components'
import { PlusOutlined } from '@comunion/icons'
import { defineComponent, onMounted, ref } from 'vue'
import StartupCard from './StartupCard'
import CreateStartupBlock from '@/blocks/Startup/Create'
import { services } from '@/services'

const Startups = defineComponent({
  name: 'Startups',
  setup(prop, ctx) {
    const myCreatedStartups = ref([])
    const slots = {
      'header-extra': () => (
        <CreateStartupBlock
          trigger={
            <span class="flex flex-row items-center text-primary font-opensans font-700 text-[14px] tracking-2px cursor-pointer">
              <PlusOutlined class="h-4 mr-3 w-4" />
              CREATE NEW{' '}
            </span>
          }
        />
      )
    }
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
      <UCard
        title="MY STARTUPS"
        size="small"
        class="p-10 font-700 font-4 leading-6 tracking-2px"
        v-slots={slots}
      >
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
