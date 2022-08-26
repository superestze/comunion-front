import { UDropdownFilter, UInputGroup, USearch } from '@comunion/components'

import { defineComponent, ref, computed, reactive, onMounted, nextTick, onBeforeUnmount } from 'vue'
import StartupCard from './components/StartupCard'
import StartupSkeleton from './components/StartupSkeleton'
import { StartupTypesType, STARTUP_TYPES } from '@/constants'
import { services } from '@/services'
import { StartupItem } from '@/types'

const StartupsPage = defineComponent({
  name: 'StartupsPage',
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

    const StartupsList = ref<StartupItem[]>([])
    const getStartups = async () => {
      const { error, data } = await services['startup@startup-list']({
        limit: pagination.pageSize,
        offset: pagination.pageSize * (pagination.page - 1),
        mode:
          startupType.value !== undefined
            ? STARTUP_TYPES.indexOf(startupType.value as StartupTypesType) + 1
            : undefined,
        keyword: inputMember.value
      })
      if (!error) {
        StartupsList.value.push(...(data!.list as unknown as StartupItem[]))
        pagination.total = data!.total
      }
    }
    const onLoadMore = async (p: number) => {
      pagination.loading = true
      pagination.page = p
      await getStartups()
      pagination.loading = false
    }

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
            // 最后一页移除事件监听
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
        // 首次加载
        onLoadMore(pagination.page)
      })
    })

    onBeforeUnmount(() => {
      document.removeEventListener('scroll', scrollHandler)
    })

    return () => (
      <div class="mt-10 mb-16">
        <div class="flex mb-8">
          {/* <h3 class="text-grey1 u-h3">{pagination.total.toLocaleString()} Startups</h3> */}
          <div class="flex ml-auto self-end items-center u-title2 ">
            Filter by:
            <UDropdownFilter
              options={STARTUP_TYPES.map(item => ({ label: item, value: item }))}
              placeholder="Startup Type"
              class="rounded border-1 h-10 ml-6 w-37"
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

        <div class="grid pb-6 gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {StartupsList.value.map((startup, i) => (
            <StartupCard startup={startup} key={i} />
          ))}
          {/* 骨架元素 */}
          {pagination.loading &&
            new Array(pagination.pageSize).fill('').map(item => <StartupSkeleton />)}
        </div>
      </div>
    )
  }
})

export default StartupsPage
