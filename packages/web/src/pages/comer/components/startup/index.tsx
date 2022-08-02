import { UCard, UDeveloping, UNoContent, UScrollList } from '@comunion/components'
import { EmptyFilled } from '@comunion/icons'
import { defineComponent, reactive, ref } from 'vue'
import ParticipatedCard from '@/pages/dashboard/components/ParticipatedCard'
import StartupCard from '@/pages/dashboard/components/StartupCard'
import { services } from '@/services'
import { StartupItem } from '@/types'

export default defineComponent({
  setup() {
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
    return {
      pagination,
      ParticipatedPagination,
      myCreatedStartups,
      myParticipatedStartups
    }
  },
  render() {
    const getCreatedStartups = async () => {
      const { error, data } = await services['startup@startup-list-me']({
        limit: this.pagination.pageSize,
        offset: this.pagination.pageSize * (this.pagination.page - 1)
      })
      if (!error) {
        this.myCreatedStartups.push(...(data!.list as unknown as StartupItem[]))
        this.pagination.total = data!.total
      }
    }
    const onLoadMore = async (p: number) => {
      this.pagination.loading = true
      this.pagination.page = p
      await getCreatedStartups()
      this.pagination.loading = false
    }
    const ParticipatedLoadMore = async (p: number) => {
      this.ParticipatedPagination.loading = true
      this.ParticipatedPagination.page = p
      // await getParticipatedStartups()
      this.ParticipatedPagination.loading = false
    }
    return (
      <UCard title="STARTUPS">
        <UScrollList
          triggered={this.pagination.loading}
          page={this.pagination.page}
          pageSize={this.pagination.pageSize}
          total={this.pagination.total}
          onLoadMore={onLoadMore}
        >
          {this.myCreatedStartups.length ? (
            this.myCreatedStartups.map((startup, i) => <StartupCard startup={startup} key={i} />)
          ) : (
            // <UDeveloping>
            //   <EmptyFilled class="mt-34" />
            // </UDeveloping>
            <UNoContent textTip="TO BE EMPTY">
              <EmptyFilled class="mt-34" />
            </UNoContent>
          )}
        </UScrollList>
        <UScrollList
          triggered={this.ParticipatedPagination.loading}
          page={this.ParticipatedPagination.page}
          pageSize={this.ParticipatedPagination.pageSize}
          total={this.ParticipatedPagination.total}
          onLoadMore={ParticipatedLoadMore}
        >
          {this.myParticipatedStartups.length ? (
            this.myParticipatedStartups.map((startup, i) => (
              <ParticipatedCard startup={startup} key={i} />
            ))
          ) : (
            <UDeveloping>
              <EmptyFilled class="mt-34" />
            </UDeveloping>
          )}
        </UScrollList>
        {/* <CreateStartupBlock ref={createRef} /> */}
      </UCard>
    )
  }
})
