import { UCard, ULazyImage, UScrollList, UTag } from '@comunion/components'
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
        tokenName = props.buyTokenName
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
      <UCard title="Investment record">
        {!!this.investRecords?.length && (
          <UScrollList
            triggered={this.pagination.loading}
            page={this.pagination.page}
            pageSize={this.pagination.pageSize}
            total={this.pagination.total}
            onLoadMore={() => this.getInvestRecord(this.pagination.page)}
          >
            {(this.investRecords ?? []).map(record => {
              return (
                <div class="flex mb-4">
                  <ULazyImage
                    src={record.comerAvatar ?? ''}
                    class="rounded-full cursor-pointer h-12 w-12"
                  />
                  <div class=" flex-1 mx-4">
                    <div class="flex mb-2 items-center">
                      <div class="text-color1 truncate u-h4">{record.comerName}</div>
                      <UTag class="ml-2 text-color3">
                        {record.access === 1 ? 'Invest' : 'Sell'}
                      </UTag>
                    </div>
                    <div class="mb-2 text-color3 u-h7">
                      {dayjs(record.time).format('YYYY-MM-DD HH:mm')}
                    </div>
                  </div>
                  <div class=" text-primary">{this.getAmount(record)}</div>
                </div>
              )
            })}
          </UScrollList>
        )}
      </UCard>
    )
  }
})
