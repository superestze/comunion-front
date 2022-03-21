import { UDropdownFilter, UPaginatedList, UPaginatedListPropsType } from '@comunion/components'
import { defineComponent, ref } from 'vue'
import { STARTUP_TYPES } from '@/constants'
import { services } from '@/services'
import { StartupItem } from '@/types'

const StartupsPage = defineComponent({
  name: 'StartupsPage',
  setup() {
    const startupType = ref('')
    const total = ref(0)
    const dataService: UPaginatedListPropsType['service'] = async (page, pageSize) => {
      const { error, data } = await services['startup@startup-list']({
        limit: pageSize,
        offset: pageSize * (page - 1),
        mode: startupType.value,
        keyword: ''
      })
      const total = error ? 0 : data.total
      return { items: error ? [] : data.list, total }
    }

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
            />
          </div>
        </div>
        <UPaginatedList service={dataService}>
          {{
            default: (startups: StartupItem[]) => {
              return (
                <div class="mt-8 mb-4 grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {/* {startups.map(startup => (
                    <StartupCard startup={startup} />
                  ))} */}
                  {/* <StartupCard startup={{}} />
                  <StartupCard startup={{}} />
                  <StartupCard startup={{}} /> */}
                </div>
              )
            }
          }}
        </UPaginatedList>
      </div>
    )
  }
})

export default StartupsPage
