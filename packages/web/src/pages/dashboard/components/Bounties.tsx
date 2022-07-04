import { UCard, UDeveloping, UTabPane, UTabs, UScrollList, UNoContent } from '@comunion/components'
import { EmptyFilled, PlusOutlined } from '@comunion/icons'
import { defineComponent, ref, watch, onMounted, reactive } from 'vue'
import ApprovedCard from './ApprovedCard'
import CreateBountyBlock, { CreateBountyRef } from '@/blocks/Bounty/Create'
import NoStartupTip from '@/layouts/default/blocks/Create/components/NoStartupTip'
import { services } from '@/services'
import { useUserStore } from '@/stores'
import { StartupItem } from '@/types'

const Bounties = defineComponent({
  name: 'Bounties',
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

    onMounted(() => {
      // getParticipatedStartups()
      getCreatedStartups()
    })

    const tabsDateChange = async (value: number) => {
      if (value) {
        myCreatedStartups.value = []
        await tabsDateChangeFun(pagination)
        await getCreatedStartups()
        pagination.loading = false
      } else {
        myParticipatedStartups.value = []
        await tabsDateChangeFun(ParticipatedPagination)
        await getParticipatedStartups()
        ParticipatedPagination.loading = false
      }
    }
    const tabsDateChangeFun = async (val: {
      pageSize: number
      total: number
      page: number
      loading: boolean
    }) => {
      val.loading = true
      val.pageSize = 4
      val.page = 1
    }
    const userHasStartup = ref(false)
    const createRef = ref<CreateBountyRef>()
    const noStartupRef = ref()
    const userStore = useUserStore()

    const getStartupByComerId = async (comerID: number | undefined) => {
      try {
        const { error, data } = await services['bounty@bounty-startups']({
          comerID
        })
        if (!error) {
          userHasStartup.value = !!(data.list || []).length
        }
      } catch (error) {
        console.error('error', error)
      }
    }

    watch(
      () => userStore.profile?.comerID,
      () => {
        if (userStore.profile?.comerID) {
          getStartupByComerId(userStore.profile?.comerID)
        }
      },
      {
        immediate: true
      }
    )

    const createNewBounty = () => {
      if (userHasStartup.value) {
        createRef.value?.show()
      } else {
        noStartupRef.value?.show()
      }
    }
    return () => (
      <UCard
        title="BOUNTIES"
        v-slots={{
          'header-extra': () => (
            <span
              class="cursor-pointer flex flex-row text-primary items-center u-label2"
              onClick={createNewBounty}
            >
              <PlusOutlined class="h-4 mr-3 w-4" />
              CREATE NEW
            </span>
          )
        }}
      >
        <CreateBountyBlock ref={createRef} />
        <NoStartupTip ref={noStartupRef} />
        <UTabs
          onUpdateValue={(value: number) => {
            tabsDateChange(value)
          }}
        >
          <UTabPane name={1} tab="APPROVED">
            <UScrollList
              triggered={pagination.loading}
              page={pagination.page}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onLoadMore={onLoadMore}
            >
              {myCreatedStartups.value.length ? (
                myCreatedStartups.value.map((startup: any, i: any) => (
                  <ApprovedCard startup={startup} key={i} />
                ))
              ) : (
                <UNoContent textTip="TO BE EMPTY">
                  <EmptyFilled class="mt-34" />
                </UNoContent>
              )}
            </UScrollList>
          </UTabPane>
          <UTabPane name={0} tab="POSTED BY ME">
            <UScrollList
              triggered={ParticipatedPagination.loading}
              page={ParticipatedPagination.page}
              pageSize={ParticipatedPagination.pageSize}
              total={ParticipatedPagination.total}
              onLoadMore={ParticipatedLoadMore}
            >
              {myParticipatedStartups.value.length ? (
                myParticipatedStartups.value.map((startup: any, i: any) => (
                  <ApprovedCard startup={startup} key={i} />
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

export default Bounties
