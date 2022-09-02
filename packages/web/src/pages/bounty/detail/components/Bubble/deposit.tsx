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
          <div class="text-success u-card-title2 flex items-center">
            +{props.depositInfo?.tokenAmount} USDC
          </div>
        )
      } else if (props.depositInfo?.access === 2) {
        return () => (
          <div class="text-warning u-card-title2 flex items-center">
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
            <div class="flex justify-between flex-grow">
              <div class="flex flex-col ml-5">
                <p class="mb-2 u-title1">{this.depositInfo?.name}</p>
                <p class="text-14px text-grey3">
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
