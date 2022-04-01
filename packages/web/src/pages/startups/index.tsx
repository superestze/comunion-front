import { UDropdownFilter, UPaginatedList, UPaginatedListPropsType } from '@comunion/components'
import { defineComponent, ref, computed } from 'vue'
import StartupCard from './components/StartupCard'
import { StartupTypesType, STARTUP_TYPES } from '@/constants'
import { services } from '@/services'
import { StartupItem } from '@/types'

const StartupsPage = defineComponent({
  name: 'StartupsPage',
  setup() {
    const startupType = ref<string>(undefined)
    const total = ref(0)
    const dataService = computed<UPaginatedListPropsType['service']>(
      () => async (page, pageSize) => {
        const { error, data } = await services['startup@startup-list']({
          limit: pageSize,
          offset: pageSize * (page - 1),
          mode:
            startupType.value !== undefined
              ? STARTUP_TYPES.indexOf(startupType.value as StartupTypesType) + 1
              : undefined,
          keyword: ''
        })
        const _total = error ? 0 : data.total
        total.value = _total
        return { items: error ? [] : data.list, total: _total }
      }
    )

    return () => (
      <div class="my-20">
        <div class="flex">
          <h3 class="text-grey1 u-h3">{total.value.toLocaleString()} Startups available</h3>
          <div class="flex ml-auto self-end items-center u-title2">
            Filter by:
            <UDropdownFilter
              options={STARTUP_TYPES.map(item => ({ label: item, value: item }))}
              placeholder="Company Type"
              class="ml-8 w-37"
              clearable
              v-model:value={startupType.value}
            />
          </div>
        </div>
        <UPaginatedList
          service={dataService.value}
          children={({ dataSource: startups }: { dataSource: StartupItem[] }) => {
            return (
              <div class="mt-8 mb-4 grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {startups.map(startup => (
                  <StartupCard key={startup.id} startup={startup} />
                ))}
              </div>
            )
          }}
        />
      </div>
    )
  }
})

export default StartupsPage
