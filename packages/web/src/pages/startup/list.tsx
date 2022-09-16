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
import StartupCard from './components/StartupCard'
import StartupSkeleton from './components/StartupSkeleton'
import SearchInput from '@/components/SearchInput'
import { StartupTypesType, STARTUP_TYPES } from '@/constants'
import { services } from '@/services'
import { StartupItem } from '@/types'

const StartupsPage = defineComponent({
  name: 'StartupsPage',
  setup() {
    const searchType = ref<string | undefined>(undefined)
    const searchInput = ref<string>('')
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

    const DataList = ref<StartupItem[]>([])
    const fetchData = async (reload?: boolean) => {
      const { error, data } = await services['startup@startup-list']({
        limit: pagination.pageSize,
        offset: pagination.pageSize * (pagination.page - 1),
        mode:
          searchType.value !== undefined
            ? STARTUP_TYPES.indexOf(searchType.value as StartupTypesType) + 1
            : undefined,
        keyword: searchInput.value
      })
      if (!error) {
        if (reload) {
          DataList.value = data!.list as unknown as StartupItem[]
        } else {
          DataList.value.push(...(data!.list as unknown as StartupItem[]))
        }

        pagination.total = data!.total
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
      () => searchType.value,
      () => debounceLoad(1, true)
    )

    watch(
      () => searchInput.value,
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
          <div class="flex mb-6 items-center ">
            <div class="flex-1">
              {/* <h3 class="text-grey1 u-h3">{pagination.total.toLocaleString()} Startups</h3> */}
            </div>
            <UDropdownFilter
              options={STARTUP_TYPES.map(item => ({ label: item, value: item }))}
              placeholder="All Type"
              class="mr-4 w-28 "
              clearable
              v-model:value={searchType.value}
              consistent-menu-width={false}
            />
            <SearchInput
              v-model:value={searchInput.value}
              placeholder="Search"
              loading={pagination.loading}
            />
          </div>

          <div class="grid pb-6 gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {DataList.value.map(startup => (
              <StartupCard startup={startup} key={startup.id} />
            ))}
            {pagination.loading &&
              new Array(pagination.pageSize).fill('').map(item => <StartupSkeleton />)}
          </div>
        </div>
      </USpin>
    )
  }
})

export default StartupsPage
