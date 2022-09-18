import { UDropdownFilter, USpin, UTab, UTabs } from '@comunion/components'
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
import BountyCard from './components/BountyCard'
import BountySkeleton from './components/BountySkeleton'
import SearchInput from '@/components/SearchInput'
import { BOUNTY_TYPES } from '@/constants'
import { services } from '@/services'

import { BountyItem } from '@/types'

const BountyPage = defineComponent({
  name: 'BountyPage',
  setup() {
    const searchType = ref(undefined)
    const searchInput = ref<string>('')
    const DataList = ref<BountyItem[]>([])
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
      const { error, data } = await services['bounty@bounty-list(tab)']({
        page: pagination.page,
        mode:
          searchType.value !== undefined ? BOUNTY_TYPES.indexOf(searchType.value) + 1 : undefined,
        keyword: searchInput.value,
        sort: ''
      })
      if (!error) {
        if (reload) {
          DataList.value = data!.rows as unknown as BountyItem[]
        } else {
          DataList.value.push(...(data!.rows as unknown as BountyItem[]))
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

    const tabsChange = (tabName: string) => {
      console.log(tabName)
      return false
    }

    return () => (
      <USpin show={pagination.loading}>
        <div class="mt-8 mb-16">
          <div class="flex mb-6">
            <div class="flex-1">
              <UTabs onBeforeLeave={tabsChange} class="no-border">
                <UTab name="Bounty ">
                  <span class="font-100 text-[14px]">Bounty</span>
                </UTab>
                <UTab name="Offering" disabled>
                  <span class=" text-color3 font-100 text-[14px]">Offering</span>
                </UTab>
              </UTabs>
            </div>
            <div class="flex items-start">
              <UDropdownFilter
                options={BOUNTY_TYPES.map(item => ({ label: item, value: item }))}
                placeholder="All Status"
                class="rounded mr-4 w-37"
                clearable
                v-model:value={searchType.value}
              />

              <SearchInput
                v-model:value={searchInput.value}
                placeholder="Search"
                loading={pagination.loading}
              />
            </div>
          </div>
          {DataList.value.map(item => (
            <BountyCard key={item.bountyId} startup={item} />
          ))}
          {pagination.loading &&
            new Array(pagination.pageSize).fill('').map(item => <BountySkeleton />)}
        </div>
      </USpin>
    )
  }
})

export default BountyPage
