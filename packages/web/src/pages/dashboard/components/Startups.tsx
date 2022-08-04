import { UCard, UDeveloping, UScrollList, UTabPane, UTabs, UNoContent } from '@comunion/components'
import { EmptyFilled, PlusOutlined } from '@comunion/icons'
import { defineComponent, onMounted, reactive, ref } from 'vue'
import ParticipatedCard from './ParticipatedCard'
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
    const ParticipatedPagination = reactive<{
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
    const myParticipatedStartups = ref<StartupItem[]>([])
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
    const getParticipatedStartups = async () => {
      const { error, data } = await services['startup@startup-list-participated']({
        limit: ParticipatedPagination.pageSize,
        offset: ParticipatedPagination.pageSize * (ParticipatedPagination.page - 1),
        keyword: null,
        mode: null
      })
      if (!error) {
        myParticipatedStartups.value.push(...(data!.list as unknown as StartupItem[]))
        ParticipatedPagination.total = data!.total
      }
    }

    const onLoadMore = async (p: number) => {
      pagination.loading = true
      pagination.page = p
      await getCreatedStartups()
      pagination.loading = false
    }
    const ParticipatedLoadMore = async (p: number) => {
      ParticipatedPagination.loading = true
      ParticipatedPagination.page = p
      await getParticipatedStartups()
      ParticipatedPagination.loading = false
    }

    const createNewStartup = () => {
      createRef.value?.show()
    }

    onMounted(() => {
      // getParticipatedStartups()
      getCreatedStartups()
    })

    const tabsDateChange = async (value: string) => {
      if (value === 'CREATED BY ME') {
        myCreatedStartups.value = []
        await tabsDateChangeFun(pagination)
        await getCreatedStartups()
        pagination.loading = false
      } else if (value === 'PARTICIPATED') {
        myParticipatedStartups.value = []
        await tabsDateChangeFun(ParticipatedPagination)
        await getParticipatedStartups()
        ParticipatedPagination.loading = false
      }
    }
    const tabsDateChangeFun = async (val: any) => {
      val.loading = true
      val.pageSize = 4
      val.page = 1
    }

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
        <UTabs onUpdateValue={tabsDateChange}>
          <UTabPane name="CREATED BY ME" tab="CREATED BY ME" class="h-112">
            <UScrollList
              triggered={pagination.loading}
              page={pagination.page}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onLoadMore={onLoadMore}
            >
              {myCreatedStartups.value.length ? (
                myCreatedStartups.value.map((startup, i) => (
                  <StartupCard startup={startup} key={i} />
                ))
              ) : (
                <UNoContent textTip="TO BE EMPTY">
                  <EmptyFilled class="mt-34" />
                </UNoContent>
              )}
            </UScrollList>
          </UTabPane>
          <UTabPane name="PARTICIPATED" tab="PARTICIPATED" class="h-112">
            <UScrollList
              triggered={ParticipatedPagination.loading}
              page={ParticipatedPagination.page}
              pageSize={ParticipatedPagination.pageSize}
              total={ParticipatedPagination.total}
              onLoadMore={ParticipatedLoadMore}
            >
              {myParticipatedStartups.value.length ? (
                myParticipatedStartups.value.map((startup, i) => (
                  <ParticipatedCard startup={startup} key={i} />
                ))
              ) : (
                <UDeveloping>
                  <EmptyFilled class="mt-34" />
                </UDeveloping>
              )}
            </UScrollList>
          </UTabPane>
        </UTabs>
      </UCard>
    )
  }
})

export default Startups
