import { UCard, UDeveloping, UTabPane, UTabs, UScrollList, UNoContent } from '@comunion/components'
import { EmptyFilled, PlusOutlined } from '@comunion/icons'
import { defineComponent, ref, onMounted, reactive } from 'vue'
import BountiesCard from '../../startup/detail/components/Bounties'
import CreateBountyBlock, { CreateBountyRef } from '@/blocks/Bounty/Create'
import CreateStartupBlock, { CreateStartupRef } from '@/blocks/Startup/Create'
import NoStartupTip from '@/layouts/default/blocks/Create/components/NoStartupTip'
import { services, ServiceReturn } from '@/services'
type BountyType = NonNullable<ServiceReturn<'bounty@my-posted-bounty-list'>>['rows']

const Bounties = defineComponent({
  name: 'Bounties',
  props: {
    userHasStartup: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const pagination = reactive({
      pageSize: 4,
      total: 0,
      page: 1,
      loading: false
    })
    const PageName = ref('dashboard')
    const myCreatedStartups = ref<BountyType>([])
    const getCreatedStartups = async () => {
      const { error, data } = await services['bounty@my-posted-bounty-list']({
        page: pagination.page
      })
      if (!error) {
        myCreatedStartups.value.push(...(data!.rows ?? []))
        pagination.total = data!.totalRows
      }
    }
    const getParticipatedStartups = async () => {
      const { error, data } = await services['bounty@my-participated-bounty-list']({
        page: pagination.page
      })
      if (!error) {
        myCreatedStartups.value.push(...(data!.rows ?? []))
        pagination.total = data!.totalRows
      }
    }

    const onLoadMore = async (p: number, val: number) => {
      // pagination.loading = true
      // pagination.page = p
      // if (val) {
      //   await getCreatedStartups()
      // } else {
      //   await getParticipatedStartups()
      // }
      // pagination.loading = false
    }

    onMounted(() => {
      getParticipatedStartups()
    })

    const tabsDateChange = async (value: number) => {
      pagination.total = 0
      pagination.page = 1
      pagination.loading = false
      myCreatedStartups.value = []
      await tabsDateChangeFun(pagination)
      if (value) {
        await getCreatedStartups()
      } else {
        await getParticipatedStartups()
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
    // const userHasStartup = ref(false)
    const createStartupRef = ref<CreateStartupRef>()
    const createRef = ref<CreateBountyRef>()
    const noStartupRef = ref()
    // const userStore = useUserStore()

    const onCreateStartup = () => {
      createStartupRef.value?.show()
    }

    // watch(
    //   () => userStore.profile?.comerID,
    //   () => {
    //     if (userStore.profile?.comerID) {
    //       getStartupByComerId(userStore.profile?.comerID)
    //     }
    //   },
    //   {
    //     immediate: true
    //   }
    // )

    const createNewBounty = () => {
      if (props.userHasStartup) {
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
        <CreateStartupBlock ref={createStartupRef} />
        <CreateBountyBlock ref={createRef} />
        <NoStartupTip ref={noStartupRef} onToCreate={onCreateStartup} />
        <UTabs
          onUpdateValue={(value: number) => {
            tabsDateChange(value)
          }}
        >
          <UTabPane name={0} tab="PARTICIPATED" class="h-260">
            <UScrollList
              triggered={pagination.loading}
              page={pagination.page}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onLoadMore={() => {
                onLoadMore(pagination.page, 1)
              }}
            >
              {myCreatedStartups.value.length ? (
                myCreatedStartups.value.map((startup, i) => (
                  <BountiesCard
                    startup={startup}
                    key={i}
                    name={PageName.value as string}
                    status={startup.onChainStatus as string}
                  />
                ))
              ) : (
                <UNoContent textTip="TO BE EMPTY">
                  <EmptyFilled class="mt-34" />
                </UNoContent>
              )}
            </UScrollList>
          </UTabPane>
          <UTabPane name={1} tab="POSTED BY ME" class="h-260">
            <UScrollList
              triggered={pagination.loading}
              page={pagination.page}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onLoadMore={() => {
                onLoadMore(pagination.page, 0)
              }}
            >
              {myCreatedStartups.value.length ? (
                myCreatedStartups.value.map((startup, i) => (
                  <BountiesCard
                    startup={startup}
                    key={i}
                    name={PageName.value as string}
                    status={startup.onChainStatus as string}
                  />
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
