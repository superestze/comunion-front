import { UCard, ULazyImage, UScrollList } from '@comunion/components'
import dayjs from 'dayjs'
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ServiceReturn, services } from '@/services'

interface TestRecord {
  avatar: string
  comerName: string
  amount: string
  buyTokenName: string
  sellTokenName: string
  recordType: string
  createdTime: string
}

interface IPagination {
  pageSize: number
  total: number
  page: number
  loading: boolean
}

export const InvestmentRecords = defineComponent({
  name: 'InvestmentRecords',
  props: {
    buyTokenName: {
      type: String
    },
    sellTokenName: {
      type: String
    }
  },
  setup(props) {
    const route = useRoute()
    const pagination = reactive<IPagination>({
      pageSize: 20,
      total: 300,
      page: 1,
      loading: false
    })
    const investRecords =
      ref<NonNullable<ServiceReturn<'crowdfunding@crowdfunding-investments'>>['rows']>()

    const getAmount = (
      record: NonNullable<ServiceReturn<'crowdfunding@crowdfunding-investments'>>['rows'][number]
    ) => {
      let operator = '+'
      let tokenName = props.buyTokenName
      if (record.access === 2) {
        operator = '-'
        tokenName = props.sellTokenName
      }
      return `${operator} ${record.amount} ${tokenName}`
    }

    const getInvestRecord = async (page = 1) => {
      try {
        const { error, data } = await services['crowdfunding@crowdfunding-investments']({
          crowdfundingId: Number(route.params.id),
          page
        })
        if (!error) {
          investRecords.value = data.rows || []
        }
      } catch (error) {
        console.error('error', error)
      }
    }

    onMounted(() => {
      getInvestRecord(pagination.page)
    })

    return () => (
      <UCard title="IBO Rate History">
        <UScrollList
          triggered={pagination.loading}
          page={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onLoadMore={() => getInvestRecord(pagination.page)}
        >
          {(investRecords.value ?? []).map(record => {
            return (
              <div class="mt-6">
                <div class="flex items-center">
                  <ULazyImage
                    src={record.comerAvatar ?? ''}
                    class="rounded-full cursor-pointer h-10 w-10"
                  />
                  <div class="ml-4">
                    <div class="mb-2">
                      <span class="u-title2">{record.comerName}</span>
                      {record.access === 1 ? (
                        <span class="px-2 py-1 ml-2 rounded-sm text-white text-xs bg-info">
                          Invest
                        </span>
                      ) : (
                        <span class="px-2 py-1 ml-2 rounded-sm text-white text-xs bg-warning">
                          Withdraw
                        </span>
                      )}
                    </div>
                    <div class="mb-2 u-body2 text-grey4">
                      {dayjs(record.time).format('YYYY-MM-DD HH:mm')}
                    </div>
                  </div>
                  <div class="ml-auto text-primary">{getAmount(record)}</div>
                </div>
                <div class="h-px ml-14 bg-grey5"></div>
              </div>
            )
          })}
        </UScrollList>
      </UCard>
    )
  }
})
