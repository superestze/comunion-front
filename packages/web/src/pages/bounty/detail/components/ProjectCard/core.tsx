import { UButton, UScrollbar } from '@comunion/components'
import { defineComponent, PropType, computed } from 'vue'
import PayedMask from '../Payment/PayedMask'
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
  name: 'ProjectCard',
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
      <div class="bg-purple border-purple border-solid rounded-md border-1 mt-2 ml-2 px-2 relative  ">
        <div class="bg-purple-light flex rounded-4px h-7 text-primary -top-2 -left-2 w-11.5 z-1 absolute justify-center items-center u-title2 ">
          {this.index}
        </div>

        <div class="rounded-md flex flex-col h-full w-full items-center relative overflow-hidden">
          {this.info?.status === 2 && <PayedMask />}
          <div class="flex flex-1 items-end">
            <div>
              {this.info?.token1Symbol && (
                <Text
                  class="mt-8 w-full"
                  half={true}
                  unit={this.info.token1Symbol}
                  value={`${this.info.token1Amount || 0}`}
                  enhance={36}
                  digit={3}
                  unitClass="text-grey1"
                />
              )}
              {this.info?.token2Symbol && (
                <Text
                  class="mt-3 mb-8 w-full"
                  half={true}
                  unit={this.info.token2Symbol}
                  value={`${this.info.token2Amount || 0}`}
                  plus={true}
                  enhance={36}
                  digit={3}
                  unitClass="text-grey1"
                />
              )}
              {this.info?.terms && (
                <div class=" my-6 overflow-hidden">
                  <UScrollbar style={{ maxHeight: `${90}px` }} class="flex">
                    <p class=" text-primary2">{this.info.terms}</p>
                  </UScrollbar>
                </div>
              )}
              {this.bountyContractStore.bountyContractInfo.role === USER_ROLE.FOUNDER && (
                <div class="flex my-8 ">
                  <UButton
                    secondary={!this.payBtnAbled}
                    disabled={!this.payBtnAbled}
                    class="bg-white flex-1"
                    type="default"
                    size="small"
                    onClick={handlePay}
                  >
                    Pay
                  </UButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
})
