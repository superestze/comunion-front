import { UDropdownFilter, UPagination } from '@comunion/components'
import { defineComponent, ref, reactive, onMounted } from 'vue'
import BountyCard from './components/BountyCard'
import { BOUNTY_TYPES } from '@/constants'
import { services } from '@/services'

const StartupsPage = defineComponent({
  name: 'StartupsPage',
  setup() {
    const startupType = ref<string>('Created:Recent')
    const total = ref(0)
    const myCreatedStartups = ref<object[]>([])
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
        myCreatedStartups.value = data!.rows ?? []
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
          <h3 class="text-grey1 u-h3">{total.value.toLocaleString()} Bounties available</h3>
          <div class="flex ml-auto self-end items-center u-title2 ">
            Sort by:
            <UDropdownFilter
              options={BOUNTY_TYPES.map(item => ({ label: item, value: item }))}
              placeholder="Startup Type"
              class="rounded border-1 h-10 ml-6 w-50"
              clearable
              v-model:value={startupType.value}
            />
          </div>
        </div>
        {myCreatedStartups.value.length && (
          <div class="p-10 bg-white rounded ">
            {myCreatedStartups.value.map((startup, i) => (
              <BountyCard key={i} startup={startup} />
            ))}
          </div>
        )}
        <div class="flex justify-end mt-10">
          <UPagination
            class="item-center"
            v-model:page={pagination.page}
            itemCount={pagination.total}
            v-model:pageSize={pagination.pageSize}
            on-update:page={updatePages}
          />
        </div>
      </div>
    )
  }
})

export default StartupsPage
