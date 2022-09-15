import { UDropdownFilter, UInputGroup, USearch } from '@comunion/components'
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
    const fetchData = async () => {
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
        dataList.value.push(...data!.rows)
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
    const onLoadMore = async (p: number) => {
      pagination.loading = true
      pagination.page = p
      await fetchData()
      pagination.loading = false
    }
    // filter
    watch(
      () => startupType.value,
      () => {
        setTimeout(() => {
          onLoadMore(1)
        }, 0)
      }
    )

    const debounceLoad = debounce(onLoadMore)
    watch(
      () => inputMember.value,
      () => {
        debounceLoad(1)
      }
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

    return () => (
      <div class="mt-10 mb-16">
        <div class="flex mb-8">
          {/* <h3 class="text-grey1 u-h3">{total.value.toLocaleString()} Available</h3> */}
          <div class="flex ml-auto self-end items-center u-body4">
            Filter by:
            <UDropdownFilter
              options={CROWDFUNDING_TYPES.map(item => ({ label: item, value: item }))}
              placeholder="ALL status"
              class="rounded border-1 h-10 ml-6 w-37 uppercase"
              clearable
              v-model:value={startupType.value}
            />
            <UInputGroup class="h-10 ml-6 w-37 ">
              <USearch
                v-model:value={inputMember.value}
                placeholder="Search"
                class="bg-transparent -my-0\.5 "
              />
            </UInputGroup>
          </div>
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
    )
  }
})

export default CrowdfundingList
