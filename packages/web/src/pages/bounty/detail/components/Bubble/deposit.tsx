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
    },
    tokenSymbol: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const depositFn = computed(() => {
      if (props.depositInfo?.access === 1) {
        return () => (
          <div class="flex text-success items-center u-card-title2">
            +{props.depositInfo?.tokenAmount} {props.tokenSymbol}
          </div>
        )
      } else if (props.depositInfo?.access === 2) {
        return () => (
          <div class="flex text-warning items-center u-card-title2">
            -{props.depositInfo?.tokenAmount} {props.tokenSymbol}
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
                <p class="mb-2 truncate u-title3">{this.depositInfo?.name}</p>
                <p class="text-grey3 u-tag">
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
