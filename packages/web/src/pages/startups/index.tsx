import {
  UDropdownFilter,
  UPaginatedList,
  UPaginatedListPropsType,
  UInputGroup,
  USearch
} from '@comunion/components'
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import StartupCard from './components/StartupCard'
import { StartupTypesType, STARTUP_TYPES } from '@/constants'
import { services } from '@/services'
import { StartupItem } from '@/types'

const StartupsPage = defineComponent({
  name: 'StartupsPage',
  setup() {
    const router = useRouter()
    const startupType = ref<string | undefined>(undefined)
    const inputMember = ref<string>('')
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
          keyword: inputMember.value
        })
        const _total = error ? 0 : data!.total
        total.value = _total
        return { items: error ? [] : data!.list!, total: _total }
      }
    )

    const toStartDetail = (startupInfo: StartupItem) => {
      router.push({ path: '/startupdetail', query: { startupId: startupInfo!.id } })
    }

    return () => (
      <div class="mt-10 mb-16">
        <div class="flex mb-8">
          <h3 class="text-grey1 u-h3">{total.value.toLocaleString()} Startups</h3>
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
        <UPaginatedList
          service={dataService.value}
          children={({ dataSource: startups }: { dataSource: NonNullable<StartupItem>[] }) => {
            return (
              <div class="grid pb-6 gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {startups.map(startup => (
                  <StartupCard key={startup!.id} startup={startup} onClick={toStartDetail} />
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
