import { UDropdownFilter } from '@comunion/components'
import { defineComponent, ref, onMounted, reactive } from 'vue'
import BountyCard from './components/BountyCard'
import { StartupTypesType, STARTUP_TYPES } from '@/constants'
import { services } from '@/services'

const StartupsPage = defineComponent({
  name: 'StartupsPage',
  setup() {
    const startupType = ref<string | undefined>(undefined)
    const inputMember = ref<string>('')
    const total = ref(0)
    const myCreatedStartups = ref<never[]>([])
    const pagination = reactive<{
      pageSize: number
      total: number
      page: number
      loading: boolean
    }>({
      pageSize: 10,
      total: 0,
      page: 1,
      loading: false
    })
    // const dataService = computed<UPaginatedListPropsType['service']>(
    //   () => async (page, pageSize) => {
    //     const { error, data } = await services['startup@startup-list']({
    //       limit: pageSize,
    //       offset: pageSize * (page - 1),
    //       mode:
    //         startupType.value !== undefined
    //           ? STARTUP_TYPES.indexOf(startupType.value as StartupTypesType) + 1
    //           : undefined,
    //       keyword: inputMember.value
    //     })
    //     const _total = error ? 0 : data!.total
    //     total.value = _total
    //     console.log({ items: error ? [] : data!.list!, total: _total })
    //     return { items: error ? [] : data!.list!, total: _total }
    //   }
    // )
    const dataService = async () => {
      const { error, data } = await services['startup@startup-list']({
        limit: pagination.pageSize,
        offset: pagination.pageSize * (pagination.page - 1),
        mode:
          startupType.value !== undefined
            ? STARTUP_TYPES.indexOf(startupType.value as StartupTypesType) + 1
            : undefined,
        keyword: inputMember.value
      })
      const _total = error ? 0 : data!.total
      total.value = _total
      console.log({ items: error ? [] : data!.list!, total: _total })
      console.log(data)
      myCreatedStartups.value = data?.list as []
      return { items: error ? [] : data!.list!, total: _total }
    }
    onMounted(() => {
      dataService()
      console.log(dataService)
    })
    return () => (
      <div class="mt-10 mb-16">
        <div class="flex mb-8">
          <h3 class="text-grey1 u-h3">{total.value.toLocaleString()} Bounties available</h3>
          <div class="flex ml-auto self-end items-center u-title2 ">
            Sort by:
            <UDropdownFilter
              options={STARTUP_TYPES.map(item => ({ label: item, value: item }))}
              placeholder="Startup Type"
              class="rounded border-1 h-10 ml-6 w-37"
              clearable
              v-model:value={startupType.value}
            />
          </div>
        </div>
        {/* <UPaginatedList
          service={dataService.value}
          children={({ dataSource: startups }: { dataSource: NonNullable<StartupItem>[] }) => {
            return (
              <div class="grid pb-6 gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {startups.map(startup => (
                  <BountyCard key={startup.id} startup={startup} />
                ))}
              </div>
            )
          }}
        /> */}
        <div class="p-10 bg-white rounded">
          {myCreatedStartups.value.map(startup => (
            <BountyCard key={startup} startup={startup} />
          ))}
        </div>
      </div>
    )
  }
})

export default StartupsPage
