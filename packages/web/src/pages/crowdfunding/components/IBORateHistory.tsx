import { UCard } from '@comunion/components'
import dayjs from 'dayjs'
import { defineComponent, PropType } from 'vue'

export const IBORateHistory = defineComponent({
  name: 'IBORateHistory',
  props: {
    historyRecords: {
      type: Array as PropType<
        {
          buyPrice: string
          buyTokenName: string
          sellTokenName: string
          swapPercent: string
          createdTime: string
        }[]
      >
    }
  },
  setup(props) {
    return () => (
      <UCard title="IBO Rate History">
        {props.historyRecords?.map(record => {
          return (
            <div class="mb-6">
              <div class="mb-2 u-body2 text-grey4">{dayjs().format('YYYY-MM-DD HH:mm')}</div>
              <div class="border-1 border-grey5 rounded-lg bg-purple flex justify-between px-4 py-2.5">
                <span class="u-title2">
                  1 {record.buyTokenName} = {record.buyPrice} {record.sellTokenName}
                </span>
                <span class="u-title2">Swap = {record.swapPercent} %</span>
              </div>
            </div>
          )
        })}
      </UCard>
    )
  }
})
