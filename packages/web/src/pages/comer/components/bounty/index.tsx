import { UCard, UDeveloping, UNoContent, UScrollList } from '@comunion/components'
import { EmptyFilled } from '@comunion/icons'
import { defineComponent, reactive, ref, watch } from 'vue'
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
    const getBounties = async () => {
      const { error, data } = await services[
        props.createdByMe ? 'bounty@my-posted-bounty-list' : 'bounty@my-participated-bounty-list'
      ]({
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
      pagination.loading = true
      bounties.value = []
    }

    watch(
      () => props.createdByMe,
      () => {
        tabChange()
        getBounties()
      }
    )

    return {
      pagination,
      bounties,
      getBounties
    }
  },
  render() {
    const onLoadMore = async (p: number) => {
      this.pagination.loading = true
      this.pagination.page = p
      await this.getBounties()
      this.pagination.loading = false
    }
    return (
      <UCard title="BOUNTIES" class="mb-6">
        {this.createdByMe ? (
          <UScrollList
            triggered={this.pagination.loading}
            page={this.pagination.page}
            pageSize={this.pagination.pageSize}
            total={this.pagination.total}
            onLoadMore={() => onLoadMore(this.pagination.page)}
          >
            {Array.isArray(this.bounties) && this.bounties.length > 0 ? (
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
            onLoadMore={() => onLoadMore(this.pagination.page)}
          >
            {Array.isArray(this.bounties) && this.bounties.length > 0 ? (
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
