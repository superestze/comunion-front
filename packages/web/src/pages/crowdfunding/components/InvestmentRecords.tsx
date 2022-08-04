import { UCard, ULazyImage } from '@comunion/components'
import dayjs from 'dayjs'
import { defineComponent, PropType } from 'vue'

interface TestRecord {
  avatar: string
  comerName: string
  amount: string
  buyTokenName: string
  sellTokenName: string
  recordType: string
  createdTime: string
}

export const InvestmentRecords = defineComponent({
  name: 'InvestmentRecords',
  props: {
    records: {
      type: Array as PropType<TestRecord[]>
    }
  },
  setup(props) {
    const getAmount = (record: TestRecord) => {
      let operator = '+'
      let tokenName = record.buyTokenName
      if (record.recordType) {
        operator = '-'
        tokenName = record.sellTokenName
      }
      return `${operator} ${record.amount} ${tokenName}`
    }
    return () => (
      <UCard title="IBO Rate History">
        {props.records?.map(record => {
          return (
            <div class="mt-6">
              <div class="flex items-center">
                <ULazyImage
                  src={record.avatar ?? ''}
                  class="rounded-full cursor-pointer h-10 w-10"
                />
                <div class="ml-4">
                  <div class="mb-2">
                    <span class="u-title2">{record.comerName}</span>
                    {record.recordType ? (
                      <span class="px-2 py-1 ml-2 rounded-sm text-white text-xs bg-info">
                        Invest
                      </span>
                    ) : (
                      <span class="px-2 py-1 ml-2 rounded-sm text-white text-xs bg-warning">
                        Withdraw
                      </span>
                    )}
                  </div>
                  <div class="mb-2 u-body2 text-grey4">{dayjs().format('YYYY-MM-DD HH:mm')}</div>
                </div>
                <div class="ml-auto text-primary">{getAmount(record)}</div>
              </div>
              <div class="h-px ml-14 bg-grey5"></div>
            </div>
          )
        })}
      </UCard>
    )
  }
})
