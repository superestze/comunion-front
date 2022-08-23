import { UButton, UScrollbar } from '@comunion/components'
import { defineComponent, PropType, computed } from 'vue'
import Text from '../Text'
import { BOUNTY_STATUS, USER_ROLE } from '@/constants'
import { useBountyContractStore } from '@/stores/bountyContract'

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
  setup(props) {
    const bountyContractStore = useBountyContractStore()

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
        'flex flex-col relative items-center w-63 bg-purple border-purple border-1 border-solid rounded-8px mt-10px ml-2 mr-6'
      if (props.payMode === 'stage') {
        if (bountyContractStore.bountyContractInfo.role === USER_ROLE.FOUNDER) {
          return `${str} h-88`
        }
        return `${str} h-75`
      }
      return `${str} h-57`
    })

    const payBtnAbled = computed(() => {
      return bountyContractStore.bountyContractInfo.bountyStatus >= BOUNTY_STATUS.WORKSTARTED
    })
    return {
      index,
      payBtnAbled,
      wrapperClass,
      bountyContractStore
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
              class="absolute rounded-8px flex justify-center items-center inset-0 z-9"
              style={{ backgroundColor: '#5331F4', opacity: 0.4 }}
            />
            <div class="u-title2 z-10 absolute top-1/2 left-1/2 -ml-35px -mt-16px text-warning transform -rotate-15 rounded-4px w-18 h-8 bg-white flex justify-center items-center">
              PAID
            </div>
          </>
        )}
        <div class="u-title2 text-primary absolute -left-2 -top-2 z-1 text-primary w-11.5 h-7 flex justify-center items-center rounded-4px bg-purple-light">
          {this.index}
        </div>
        {this.info?.token1Symbol && (
          <Text
            class="mt-8 w-full"
            half={true}
            unit={this.info.token1Symbol}
            value={`${this.info.token1Amount || 0}`}
          />
        )}
        {this.info?.token2Symbol && (
          <Text
            class="mt-3 w-full"
            half={true}
            unit={this.info.token2Symbol}
            value={`${this.info.token2Amount || 0}`}
            plus={true}
          />
        )}
        {this.info?.terms && (
          <div class="h-25 mt-6 overflow-hidden">
            <UScrollbar style={{ maxHeight: `${90}px` }} class="flex">
              <p class="text-primary2 mx-24px">{this.info.terms}</p>
            </UScrollbar>
          </div>
        )}
        {this.bountyContractStore.bountyContractInfo.role === USER_ROLE.FOUNDER && (
          <UButton
            secondary={!this.payBtnAbled}
            disabled={!this.payBtnAbled}
            class="w-30 mt-8 bg-white"
            type="default"
            size="small"
            onClick={handlePay}
          >
            Pay
          </UButton>
        )}
      </div>
    )
  }
})
