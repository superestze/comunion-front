import { UDropdownFilter, USpin } from '@comunion/components'
import { debounce } from '@comunion/utils'
import {
  defineComponent,
  ref,
  computed,
  reactive,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick
} from 'vue'
import { ProposalCard } from './components/ProposalCard'
import { GOVERNANCE_TYPES } from '@/constants/governance'
import { ServiceReturn, services } from '@/services'
type ItemType = NonNullable<ServiceReturn<'governance@public-list'>>['rows'][number]

const GovernanceListPage = defineComponent({
  name: 'GovernanceListPage',
  setup() {
    const proposalStatus = ref<number | undefined>(undefined)

    const DataList = ref<ItemType[]>([])
    const pagination = reactive<{
      pageSize: number
      total: number | undefined
      page: number
      loading: boolean
    }>({
      pageSize: 10,
      total: 0,
      page: 1,
      loading: false
    })

    const fetchData = async (reload?: boolean) => {
      const { error, data } = await services['governance@public-list']({
        page: pagination.page,
        limit: pagination.pageSize,
        states:
          proposalStatus.value !== undefined && proposalStatus.value !== null
            ? [proposalStatus.value + 1]
            : undefined
      })
      if (!error) {
        if (reload) {
          DataList.value = (data!.rows as unknown as ItemType[]) || []
        } else {
          DataList.value.push(...(data!.rows as unknown as ItemType[]))
        }

        pagination.total = data?.totalRows
      }
    }
    const onLoadMore = async (p: number, reload?: boolean) => {
      pagination.loading = true
      pagination.page = p
      await fetchData(reload)
      pagination.loading = false
    }

    // filter
    const debounceLoad = debounce(onLoadMore)

    watch(
      () => proposalStatus.value,
      () => debounceLoad(1, true)
    )

    const isLastPage = computed(() => {
      return (pagination.page || 0) * (pagination.pageSize || 0) >= (pagination.total || 0)
    })

    let winHeight = 0
    let body = document.body
    const scrollHandler = () => {
      if (!pagination.loading) {
        const bodyRect = body?.getBoundingClientRect()

        if (bodyRect.height + bodyRect.top - winHeight < 240) {
          if (isLastPage.value) {
            document.removeEventListener('scroll', scrollHandler)
          } else {
            pagination.page++
            onLoadMore(pagination.page)
          }
        }
      }
    }

    onMounted(() => {
      nextTick(() => {
        winHeight = window.innerHeight
        body = document.body
        document.addEventListener('scroll', scrollHandler)
        onLoadMore(pagination.page)
      })
    })

    onBeforeUnmount(() => {
      document.removeEventListener('scroll', scrollHandler)
    })

    return {
      DataList,
      proposalStatus,
      pagination
    }
  },
  render() {
    return (
      <USpin show={this.pagination.loading}>
        <div class="mx-auto mt-8 mb-16 max-w-227">
          <div class="flex mb-6 ">
            <div class="flex-1"></div>
            <UDropdownFilter
              options={GOVERNANCE_TYPES.map((item, index) => ({ label: item, value: index }))}
              placeholder="All Status"
              class="rounded w-28"
              clearable
              v-model:value={this.proposalStatus}
            />
          </div>
          {Array.isArray(this.DataList) &&
            this.DataList.map(item => <ProposalCard key={item.proposalId} proposalData={item} />)}
        </div>
      </USpin>
    )
  }
})

export default GovernanceListPage
