import { UCard, UDeveloping, UScrollList, UTabPane, UTabs } from '@comunion/components'
import { PlusOutlined } from '@comunion/icons'
import { defineComponent, onMounted, reactive, ref } from 'vue'
import StartupCard from './StartupCard'
import CreateStartupBlock from '@/blocks/Startup/Create'
import { services } from '@/services'
import { StartupItem } from '@/types'

const Startups = defineComponent({
  name: 'Startups',
  setup(prop, ctx) {
    const pagination = reactive<{
      pageSize: number
      total: number
      page: number
      loading: boolean
    }>({
      pageSize: 4,
      total: 0,
      page: 1,
      loading: false
    })
    const myCreatedStartups = ref<StartupItem[]>([])
    const slots = {
      'header-extra': () => (
        <CreateStartupBlock>
          <span class="flex flex-row items-center text-primary font-opensans font-700 text-[14px] tracking-2px cursor-pointer">
            <PlusOutlined class="h-4 mr-3 w-4" />
            CREATE NEW
          </span>
        </CreateStartupBlock>
      )
    }
    const getCreatedStartups = async () => {
      const { error, data } = await services['startup@startup-list-me']({
        limit: pagination.pageSize,
        offset: pagination.pageSize * (pagination.page - 1)
      })
      if (!error) {
        // @ts-ignore
        myCreatedStartups.value = [...myCreatedStartups.value, ...data!.list]
        pagination.total = data!.total
      }
    }

    const onLoadMore = async (p: number) => {
      pagination.loading = true
      pagination.page = p
      await getCreatedStartups()
      pagination.loading = false
    }

    onMounted(() => {
      getCreatedStartups()
    })

    return () => (
      <UCard
        title="STARTUPS"
        size="small"
        class="p-10 font-700 font-4 leading-6 tracking-2px"
        v-slots={slots}
      >
        <UTabs>
          <UTabPane name="PARTICIPATED" tab="PARTICIPATED">
            <UDeveloping />
          </UTabPane>
          <UTabPane name="CREATED BY ME" tab="CREATED BY ME" class="h-112">
            <UScrollList
              triggered={pagination.loading}
              page={pagination.page}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onLoadMore={onLoadMore}
            >
              {myCreatedStartups.value.length ? (
                myCreatedStartups.value.map(startup => <StartupCard startup={startup} />)
              ) : (
                <UDeveloping />
              )}
            </UScrollList>
          </UTabPane>
        </UTabs>
      </UCard>
    )
  }
})

export default Startups
