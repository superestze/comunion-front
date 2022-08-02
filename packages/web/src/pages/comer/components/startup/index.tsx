import { UCard, UDeveloping, UNoContent, UScrollList } from '@comunion/components'
import { EmptyFilled } from '@comunion/icons'
import { defineComponent, reactive, ref, onMounted } from 'vue'
import ParticipatedCard from '@/pages/dashboard/components/ParticipatedCard'
import StartupCard from '@/pages/dashboard/components/StartupCard'
import { services } from '@/services'
import { StartupItem } from '@/types'

export default defineComponent({
  props: {
    createdByMe: {
      type: Boolean,
      default: () => true
    }
  },
  setup(props) {
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

    onMounted(() => {
      if (props.createdByMe) {
        getCreatedStartups()
      } else {
        getParticipatedStartups()
      }
    })
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
    return {
      pagination,
      ParticipatedPagination,
      myCreatedStartups,
      myParticipatedStartups,
      getCreatedStartups,
      getParticipatedStartups
    }
  },
  render() {
    const onLoadMore = async (p: number) => {
      this.pagination.loading = true
      this.pagination.page = p
      await this.getCreatedStartups()
      this.pagination.loading = false
    }
    const ParticipatedLoadMore = async (p: number) => {
      this.ParticipatedPagination.loading = true
      this.ParticipatedPagination.page = p
      await this.getParticipatedStartups()
      this.ParticipatedPagination.loading = false
    }
    return (
      <UCard title="STARTUPS" class="mb-6">
        {this.createdByMe ? (
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
              <UNoContent textTip="TO BE EMPTY">
                <EmptyFilled />
              </UNoContent>
            )}
          </UScrollList>
        ) : (
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
                <EmptyFilled />
              </UDeveloping>
            )}
          </UScrollList>
        )}
        {/* <CreateStartupBlock ref={createRef} /> */}
      </UCard>
    )
  }
})
