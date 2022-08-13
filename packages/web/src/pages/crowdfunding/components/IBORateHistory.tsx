import { UCard, UScrollList } from '@comunion/components'
import dayjs from 'dayjs'
import { defineComponent, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ServiceReturn, services } from '@/services'

interface IPagination {
  pageSize: number
  total: number
  page: number
  loading: boolean
}

export const IBORateHistory = defineComponent({
  name: 'IBORateHistory',
  setup(props) {
    const records = ref<NonNullable<ServiceReturn<'crowdfunding@ibo-rate-histories'>>['rows']>()
    const route = useRoute()
    const pagination = reactive<IPagination>({
      pageSize: 20,
      total: 300,
      page: 1,
      loading: false
    })
    const getHistories = async (page = 1) => {
      try {
        const { error, data } = await services['crowdfunding@ibo-rate-histories']({
          crowdfundingId: Number(route.params.id),
          page
        })
        if (!error) {
          records.value = data.rows || []
        }
      } catch (error) {
        console.error('error', error)
      }
    }

    return () => (
      <UCard title="IBO Rate History">
        <UScrollList
          triggered={pagination.loading}
          page={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onLoadMore={() => getHistories(pagination.page)}
        >
          {(records.value || [])?.map(record => {
            return (
              <div class="mb-6">
                <div class="mb-2 u-body2 text-grey4">{dayjs().format('YYYY-MM-DD HH:mm')}</div>
                <div class="border-1 border-grey5 rounded-lg bg-purple flex justify-between px-4 py-2.5">
                  <span class="u-title2">
                    1 {record.buyTokenSymbol} = {record.buyPrice} {record.sellTokenSymbol}
                  </span>
                  <span class="u-title2">Swap = {record.swapPercent} %</span>
                </div>
              </div>
            )
          })}
        </UScrollList>
      </UCard>
    )
  }
})
