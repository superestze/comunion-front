import { UCard, UDeveloping, UScrollList, UTabPane, UTabs } from '@comunion/components'
import { EmptyFilled, PlusOutlined } from '@comunion/icons'
import { defineComponent, onMounted, reactive, ref } from 'vue'
import StartupCard from './StartupCard'
import CreateStartupBlock, { CreateStartupRef } from '@/blocks/Startup/Create'
import { services } from '@/services'
import { StartupItem } from '@/types'

const Startups = defineComponent({
  name: 'Startups',
  setup() {
    const createRef = ref<CreateStartupRef>()
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
    const getCreatedStartups = async () => {
      const { error, data } = await services['startup@startup-list-me']({
        limit: pagination.pageSize,
        offset: pagination.pageSize * (pagination.page - 1)
      })
      if (!error) {
        myCreatedStartups.value.push(...(data!.list as unknown as StartupItem[]))
        pagination.total = data!.total
      }
    }

    const onLoadMore = async (p: number) => {
      pagination.loading = true
      pagination.page = p
      await getCreatedStartups()
      pagination.loading = false
    }

    const createNewStartup = () => {
      createRef.value?.show()
    }

    onMounted(() => {
      getCreatedStartups()
    })

    return () => (
      <UCard
        title="STARTUPS"
        v-slots={{
          'header-extra': () => (
            <span
              class="cursor-pointer flex flex-row text-primary items-center u-label2"
              onClick={createNewStartup}
            >
              <PlusOutlined class="h-4 mr-3 w-4" />
              CREATE NEW
            </span>
          )
        }}
      >
        <CreateStartupBlock ref={createRef} />
        <UTabs>
          {/* TODO @zehui if PARTICIPATED list finished, PARTICIPATED list should before "created by me" startup list */}
          <UTabPane name="CREATED BY ME" tab="CREATED BY ME" class="h-112">
            <EmptyFilled class="mt-34" />
          </UTabPane>
          <UTabPane name="PARTICIPATED" tab="PARTICIPATED">
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
