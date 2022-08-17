import { UCard, UNoContent, UScrollList } from '@comunion/components'
import { EmptyFilled } from '@comunion/icons'
import { defineComponent, reactive, ref } from 'vue'
import BountiesCard from '@/pages/startup/detail/components/Bounties'
import { ServiceReturn, services } from '@/services'

type BountyType = NonNullable<ServiceReturn<'bounty@startup-bounty-list'>>['rows']

export default defineComponent({
  props: {
    startupId: {
      type: String,
      default: () => ''
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
      const { error, data } = await services['bounty@startup-bounty-list']({
        page: pagination.page,
        startupId: props.startupId
      })
      if (!error) {
        bounties.value.push(...(data!.rows ?? []))
        pagination.total = data!.totalRows
      }
    }
    getBounties()
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
        <UScrollList
          triggered={this.pagination.loading}
          page={this.pagination.page}
          pageSize={this.pagination.pageSize}
          total={this.pagination.total}
          onLoadMore={() => onLoadMore(this.pagination.page)}
        >
          {Array.isArray(this.bounties) && this.bounties.length > 0 ? (
            this.bounties.map((bounty, i) => (
              <BountiesCard startup={bounty} key={i} name="dashboard" status={''} />
            ))
          ) : (
            <UNoContent textTip="TO BE EMPTY">
              <EmptyFilled />
            </UNoContent>
          )}
        </UScrollList>
      </UCard>
    )
  }
})
