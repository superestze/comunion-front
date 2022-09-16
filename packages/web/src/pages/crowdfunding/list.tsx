import { UDropdownFilter, USpin } from '@comunion/components'
import { debounce } from '@comunion/utils'
import {
  defineComponent,
  ref,
  computed,
  reactive,
  onMounted,
  nextTick,
  onBeforeUnmount,
  watch
} from 'vue'
import { useRouter } from 'vue-router'
import { CrowdfundingCard } from './components/CrowdfundingCard'
import CrowdfundingSkeleton from './components/CrowdfundingSkeleton'
import SearchInput from '@/components/SearchInput'
import { CrowdfundingType, CROWDFUNDING_TYPES } from '@/constants'
import { services } from '@/services'
import { CrowdfundingItem } from '@/types'
import { checkSupportNetwork } from '@/utils/wallet'

const CrowdfundingList = defineComponent({
  name: 'CrowdfundingList',
  setup() {
    const startupType = ref<string | undefined>(undefined)
    const inputMember = ref<string>('')
    const pagination = reactive<{
      pageSize: number
      total: number
      page: number
      loading: boolean
    }>({
      pageSize: 24,
      total: 0,
      page: 1,
      loading: false
    })

    const dataList = ref<CrowdfundingItem[]>([])
    const fetchData = async (reload?: boolean) => {
      const { error, data } = await services['crowdfunding@public-crowdfunding-list']({
        limit: pagination.pageSize,
        page: pagination.page,
        mode:
          startupType.value !== undefined
            ? CROWDFUNDING_TYPES.indexOf(startupType.value as CrowdfundingType) + 1
            : undefined,
        keyword: inputMember.value
      })
      if (!error) {
        if (reload) {
          dataList.value = data?.rows || []
        } else {
          dataList.value.push(...(data?.rows || []))
        }

        pagination.total = data!.totalRows
      }
    }

    const router = useRouter()

    const toDetail = async (crowdfundingId: number, chainId: number) => {
      const isSupport = await checkSupportNetwork(chainId)
      if (isSupport) {
        router.push('/crowdfunding/' + crowdfundingId)
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
      () => startupType.value,
      () => debounceLoad(1, true)
    )

    watch(
      () => inputMember.value,
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
          if (!isLastPage.value) {
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

    return () => (
      <USpin show={pagination.loading}>
        <div class="mt-8 mb-16">
          <div class="flex mb-6">
            <div class="flex-1">
              {/* <h3 class="text-grey1 u-h3">{total.value.toLocaleString()} Available</h3> */}
            </div>
            <UDropdownFilter
              options={CROWDFUNDING_TYPES.map(item => ({ label: item, value: item }))}
              placeholder="All Status"
              class="rounded mr-4 w-28"
              clearable
              v-model:value={startupType.value}
            />
            <SearchInput
              v-model:value={inputMember.value}
              placeholder="Search"
              loading={pagination.loading}
            />
          </div>
          <div class="grid pb-6 gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {dataList.value.map(crowdfunding => (
              <CrowdfundingCard
                key={crowdfunding.crowdfundingId}
                info={crowdfunding}
                onClick={() => toDetail(crowdfunding.crowdfundingId, crowdfunding.chainId)}
              />
            ))}
            {pagination.loading &&
              new Array(pagination.pageSize).fill('').map(item => <CrowdfundingSkeleton />)}
          </div>
        </div>
      </USpin>
    )
  }
})

export default CrowdfundingList
