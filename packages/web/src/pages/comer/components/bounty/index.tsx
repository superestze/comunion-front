import { UCard, UDeveloping, UNoContent, UScrollList } from '@comunion/components'
import { EmptyFilled } from '@comunion/icons'
import { defineComponent, reactive, ref, watchEffect } from 'vue'
import { CreateStartupRef } from '@/blocks/Startup/Create'
import BountiesCard from '@/pages/startup/detail/components/Bounties'
import { ServiceReturn, services } from '@/services'

type BountyType = NonNullable<ServiceReturn<'bounty@my-posted-bounty-list'>>['rows']

export default defineComponent({
  props: {
    createdByMe: {
      type: Boolean,
      default: () => true
    },
    userHasStartup: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const pagination = reactive({
      pageSize: 4,
      total: 0,
      page: 1,
      loading: false
    })
    const bounties = ref<BountyType>([])
    const getCreatedStartups = async () => {
      const { error, data } = await services['bounty@my-posted-bounty-list']({
        page: pagination.page
      })
      if (!error) {
        bounties.value.push(...(data!.rows ?? []))
        pagination.total = data!.totalRows
      }
    }
    const getParticipatedStartups = async () => {
      const { error, data } = await services['bounty@my-participated-bounty-list']({
        page: pagination.page
      })
      if (!error) {
        bounties.value.push(...(data!.rows ?? []))
        pagination.total = data!.totalRows
      }
    }

    const tabChange = () => {
      pagination.total = 0
      pagination.page = 1
      pagination.loading = false
      bounties.value = []
      tabsDateChangeFun(pagination)
    }
    const tabsDateChangeFun = (val: {
      pageSize: number
      total: number
      page: number
      loading: boolean
    }) => {
      val.loading = true
      val.pageSize = 4
      val.page = 1
    }

    watchEffect(() => {
      tabChange()
      if (props.createdByMe) {
        getCreatedStartups()
      } else {
        getParticipatedStartups()
      }
    })

    // const userHasStartup = ref(false)
    const createStartupRef = ref<CreateStartupRef>()
    const createRef = ref<CreateBountyRef>()
    const noStartupRef = ref()
    // const userStore = useUserStore()

    const onCreateStartup = () => {
      createStartupRef.value?.show()
    }

    const createNewBounty = () => {
      if (props.userHasStartup) {
        createRef.value?.show()
      } else {
        noStartupRef.value?.show()
      }
    }

    return {
      pagination,
      bounties
    }
  },
  render() {
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
    return (
      <UCard title="BOUNTIES" class="mb-6">
        {this.createdByMe ? (
          <UScrollList
            triggered={this.pagination.loading}
            page={this.pagination.page}
            pageSize={this.pagination.pageSize}
            total={this.pagination.total}
            onLoadMore={() => {
              onLoadMore(this.pagination.page, 1)
            }}
          >
            {this.bounties.length ? (
              this.bounties.map((bounty, i) => (
                <BountiesCard
                  startup={bounty}
                  key={i}
                  name="dashboard"
                  status={bounty.onChainStatus as string}
                />
              ))
            ) : (
              <UNoContent textTip="TO BE EMPTY">
                <EmptyFilled />
              </UNoContent>
            )}
          </UScrollList>
        ) : (
          <UScrollList
            triggered={this.pagination.loading}
            page={this.pagination.page}
            pageSize={this.pagination.pageSize}
            total={this.pagination.total}
            onLoadMore={() => {
              onLoadMore(this.pagination.page, 0)
            }}
          >
            {this.bounties.length ? (
              this.bounties.map((bounty, i) => (
                <BountiesCard
                  startup={bounty}
                  key={i}
                  name="dashboard"
                  status={bounty.onChainStatus as string}
                />
              ))
            ) : (
              <UDeveloping>
                <EmptyFilled />
              </UDeveloping>
            )}
          </UScrollList>
        )}
      </UCard>
    )
  }
})
