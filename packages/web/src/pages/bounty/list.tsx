import { UDropdownFilter } from '@comunion/components'
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
import { BOUNTY_TYPES } from '@/constants'
import { services } from '@/services'

import { BountyItem } from '@/types'

const BountyPage = defineComponent({
  name: 'BountyPage',
  setup() {
    const CreatedType = ref('Created:Recent')
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

    const fetchData = async () => {
      const { error, data } = await services['bounty@bounty-list(tab)']({
        page: pagination.page,
        sort: CreatedType.value
      })
      if (!error) {
        DataList.value.push(...(data!.rows as unknown as BountyItem[]))
        pagination.total = data?.totalRows
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
      () => CreatedType.value,
      () => {
        setTimeout(() => {
          onLoadMore(1)
        }, 0)
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
          {/* <h3 class="text-grey1 u-h3">{pagination.total?.toLocaleString()} Bounties available</h3> */}
          <div class="flex ml-auto self-end items-center u-title2 ">
            Filter by:
            <UDropdownFilter
              options={BOUNTY_TYPES.map(item => ({ label: item, value: item }))}
              placeholder="Startup Type"
              class="rounded border-1 h-10 ml-6 w-50"
              clearable
              v-model:value={CreatedType.value}
            />
          </div>
        </div>

        {DataList.value.map(item => (
          <BountyCard key={item.bountyId} startup={item} />
        ))}
        {pagination.loading &&
          new Array(pagination.pageSize).fill('').map(item => <BountySkeleton />)}
      </div>
    )
  }
})

export default BountyPage
