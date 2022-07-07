import { UDropdownFilter, UPagination, UNoContent } from '@comunion/components'
import { EmptyFilled } from '@comunion/icons'
import { defineComponent, ref, reactive, onMounted } from 'vue'
import BountyCard from './components/BountyCard'
import { BOUNTY_TYPES } from '@/constants'
import { services, ServiceReturn } from '@/services'

const StartupsPage = defineComponent({
  name: 'StartupsPage',
  setup() {
    const startupType = ref('Created:Recent')
    const myCreatedStartups = ref<ServiceReturn<'bounty@bounty-list(tab)'>>()
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
    const dataService = async (page: number) => {
      const { error, data } = await services['bounty@bounty-list(tab)']({
        page: page,
        sort: startupType.value
      })
      if (!error) {
        pagination.total = data?.totalRows
        myCreatedStartups.value = data
      }
    }
    const updatePages = (page: number) => {
      pagination.page = page
      if (dataService instanceof Function) dataService(page)
    }
    onMounted(() => {
      dataService(pagination.page)
    })
    return () => (
      <div class="mt-10 mb-16">
        <div class="flex mb-8">
          <h3 class="text-grey1 u-h3">{pagination.total?.toLocaleString()} Bounties available</h3>
          <div class="flex ml-auto self-end items-center u-title2 ">
            Sort by:
            <UDropdownFilter
              onUpdateValue={() => {
                dataService(1)
              }}
              options={BOUNTY_TYPES.map(item => ({ label: item, value: item }))}
              placeholder="Startup Type"
              class="rounded border-1 h-10 ml-6 w-50"
              clearable
              v-model:value={startupType.value}
            />
          </div>
        </div>
        {myCreatedStartups.value?.rows ? (
          <>
            <div class="p-10 bg-white rounded ">
              {myCreatedStartups.value?.rows.map((startup, i) => (
                <BountyCard key={i} startup={startup} />
              ))}
            </div>
            <div class="flex justify-end mt-10">
              <UPagination
                class="item-center"
                v-model:page={pagination.page}
                itemCount={pagination.total}
                v-model:pageSize={pagination.pageSize}
                on-update:page={updatePages}
              />
            </div>
          </>
        ) : (
          <UNoContent textTip="NO BOUNTY YET" class="mb-80">
            <EmptyFilled class="mt-34" />
          </UNoContent>
        )}
      </div>
    )
  }
})

export default StartupsPage
