import { UCard, ULazyImage, UScrollList } from '@comunion/components'
import dayjs from 'dayjs'
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ServiceReturn, services } from '@/services'
interface IPagination {
  pageSize: number
  total: number
  page: number
  loading: boolean
}

export interface InvestmentsRecordsExpose {
  getInvestRecord: () => void
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
  setup(props, ctx) {
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

    ctx.expose({
      getInvestRecord
    })

    return {
      pagination,
      investRecords,
      getInvestRecord,
      getAmount
    }
  },
  render() {
    return (
      <UCard title="INVESTMENT RECORD">
        <UScrollList
          triggered={this.pagination.loading}
          page={this.pagination.page}
          pageSize={this.pagination.pageSize}
          total={this.pagination.total}
          onLoadMore={() => this.getInvestRecord(this.pagination.page)}
        >
          {(this.investRecords ?? []).map(record => {
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
                        <span class="px-2 py-0.5 ml-2 rounded-sm text-white text-xs bg-[#00BFA5]">
                          Invest
                        </span>
                      ) : (
                        <span class="px-2 py-0.5 ml-2 rounded-sm text-white text-xs bg-warning">
                          Withdraw
                        </span>
                      )}
                    </div>
                    <div class="mb-2 u-body2 text-grey4">
                      {dayjs(record.time).format('YYYY-MM-DD HH:mm')}
                    </div>
                  </div>
                  <div class="ml-auto text-primary font-semibold">{this.getAmount(record)}</div>
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
