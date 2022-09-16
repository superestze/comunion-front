import { format } from 'timeago.js'
import { defineComponent, PropType, computed } from 'vue'
import Bubble from './core'
import { ItemType } from './getItemType'
import { ServiceReturn } from '@/services'

export default defineComponent({
  props: {
    depositInfo: {
      type: Object as PropType<ItemType<ServiceReturn<'bounty@bounty-deposit-records'>>>,
      required: true
    }
  },
  setup(props) {
    const depositFn = computed(() => {
      if (props.depositInfo?.access === 1) {
        return () => (
          <div class="flex font-primary font-medium text-success items-center">
            +{props.depositInfo?.tokenAmount} USDC
          </div>
        )
      } else if (props.depositInfo?.access === 2) {
        return () => (
          <div class="flex font-primary font-medium text-warning items-center">
            -{props.depositInfo?.tokenAmount} USDC
          </div>
        )
      }
      return () => <span>error access</span>
    })
    return { depositFn }
  },
  render() {
    return (
      <Bubble
        avatar={this.depositInfo?.avatar}
        comerId={this.depositInfo?.comerID as unknown as string}
        v-slots={{
          default: () => (
            <div class="flex flex-1 items-center">
              <div class="flex-1 mx-4">
                <p class="font-primary font-semibold mb-2 text-[16px] truncate">
                  {this.depositInfo?.name}
                </p>
                <p class="text-grey3 u-num2 !font-400">
                  {format(this.depositInfo?.time || '', 'comunionTimeAgo')}
                </p>
              </div>
              {this.depositFn()}
            </div>
          )
        }}
      />
    )
  }
})
