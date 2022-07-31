import { UButton, UScrollbar } from '@comunion/components'
import { defineComponent, PropType, computed } from 'vue'
import Text from '../Text'
import { useBountyStore } from '@/stores'

export type BountyProjectCardType = {
  seqNum?: number
  status?: number
  token1Symbol?: string
  token2Symbol?: string
  token1Amount?: number
  token2Amount?: number
  terms?: string
}

export default defineComponent({
  props: {
    info: {
      type: String as PropType<BountyProjectCardType>
    },
    payMode: {
      type: String as PropType<'stage' | 'period'>,
      require: true
    }
  },
  emits: ['pay'],
  setup(props, ctx) {
    const bountyStore = useBountyStore()

    const leftTopCorner = computed(() => {
      const str =
        'font-orbitron font-bold text-primary text-18px absolute -left-10px -top-10px z-1 text-primary w-72px h-40px flex justify-center items-center rounded-4px'
      if (props.info?.status === 2) {
        return `${str}  bg-purple`
      }
      return `${str} bg-purple-light`
    })

    const index = computed(() => {
      if (props.info?.seqNum) {
        if (props.info.seqNum > 3) {
          return `${props.info.seqNum}TH`
        } else if (props.info.seqNum === 3) {
          return '3RD'
        } else if (props.info.seqNum === 2) {
          return '2ND'
        } else if (props.info.seqNum === 1) {
          return '1ST'
        }
      }
      return 'err'
    })

    const wrapperClass = computed(() => {
      const str =
        'flex flex-col relative items-center w-242px bg-purple border-purple border-1 border-solid rounded-8px mt-10px ml-10px'
      if (props.payMode === 'stage') {
        return `${str}  h-362px`
      }
      return `${str} h-228px`
    })

    const payBtnAbled = computed(() => {
      return (props.info?.status || 0) >= 2 && bountyStore.bountyStatus?.role === 1
    })
    return {
      leftTopCorner,
      index,
      payBtnAbled,
      wrapperClass
    }
  },
  render() {
    const handlePay = () => {
      this.$emit('pay', this.info)
    }
    return (
      <div class={this.wrapperClass}>
        {this.info?.status === 2 && (
          <>
            <div
              class="absolute bg-purple1 rounded-8px flex justify-center items-center inset-0 z-9"
              style={{ backgroundColor: '#5331F4', opacity: 0.4 }}
            />
            <div class="z-10 absolute top-1/2 left-1/2 -ml-35px -mt-16px text-warning transform -rotate-15 rounded-4px w-70px h-32px bg-white flex justify-center items-center">
              PAID
            </div>
          </>
        )}
        <div class={this.leftTopCorner}>{this.index}</div>
        {this.info?.token1Symbol && (
          <Text
            class="mt-40px"
            unit={this.info.token1Symbol}
            value={`${this.info.token1Amount || 0}`}
          />
        )}
        {this.info?.token2Symbol && (
          <Text
            class="mt-12px"
            unit={this.info.token2Symbol}
            value={`${this.info.token2Amount || 0}`}
            plus={true}
          />
        )}
        {this.info?.terms && (
          <div class="h-90px mt-26px overflow-hidden">
            <UScrollbar style={{ maxHeight: `${90}px` }} class="flex">
              <p class="text-primary2 mx-24px">{this.info.terms}</p>
            </UScrollbar>
          </div>
        )}
        <UButton
          secondary={!this.payBtnAbled}
          disabled={!this.payBtnAbled}
          class="w-100px mt-30px bg-white"
          type="default"
          size="small"
          onClick={handlePay}
        >
          Pay
        </UButton>
      </div>
    )
  }
})
