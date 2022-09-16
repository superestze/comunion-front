import { UButton } from '@comunion/components'
import { defineComponent, PropType, computed, ref } from 'vue'
import { PayDailog } from '../Dialog'
import PayedMask from './PayedMask'
import { BOUNTY_STATUS, USER_ROLE } from '@/constants'
import { useBountyContractStore } from '@/stores/bountyContract'

interface StageTerm {
  seqNum?: number
  status?: number
  token1Symbol?: string
  token2Symbol?: string
  token1Amount?: number
  token2Amount?: number
  terms?: string
}

export default defineComponent({
  name: 'StageTerm',
  props: {
    item: {
      type: Object as PropType<StageTerm>,
      default: () => {
        return {}
      }
    },
    detailChainId: {
      type: Number,
      default: () => 0
    }
  },
  emits: ['pay'],
  setup(props) {
    const bountyContractStore = useBountyContractStore()
    const visible = ref<boolean>(false)
    const flagStr = computed(() => {
      if (props.item?.seqNum) {
        if (props.item.seqNum > 3) {
          return `${props.item.seqNum}TH`
        } else if (props.item.seqNum === 3) {
          return '3RD'
        } else if (props.item.seqNum === 2) {
          return '2ND'
        } else if (props.item.seqNum === 1) {
          return '1ST'
        }
      }
      return 'err'
    })

    const payBtnAbled = computed(() => {
      return bountyContractStore.bountyContractInfo.bountyStatus >= BOUNTY_STATUS.WORKSTARTED
    })

    return {
      flagStr,
      visible,
      bountyContractStore,
      payBtnAbled
    }
  },
  render() {
    const triggerDialog = () => {
      this.visible = !this.visible
    }

    return (
      <>
        <PayDailog
          detailChainId={this.detailChainId}
          onTriggerDialog={triggerDialog}
          visible={this.visible}
          paymentInfo={this.item}
        />

        <div class="border border-solid rounded-[2px] bg-[#F5F6FA] border-[#D5CFF4] mb-6 py-6 px-16 relative overflow-hidden">
          {this.item?.status === 2 && <PayedMask />}
          <span class="rounded-br-md bg-[#D5CFF4] py-1 px-2 top-0 left-0 text-[#3F2D99] absolute u-card-title2">
            {this.flagStr}
          </span>
          <div class="flex items-center">
            <p class="flex-1 text-[#5331F4]">
              <span class="text-[#5331F4] u-h3">{this.item.token1Amount || 0}</span>
              <span class="mx-2 text-14px">{this.item.token1Symbol}</span>
              {this.item.token2Amount && (
                <span>
                  <span class="mx-2 text-20px">+</span>
                  <span class="text-[#5331F4] u-h3">{this.item.token2Amount}</span>
                  <span class="mx-2 text-14px">{this.item.token2Symbol}</span>
                </span>
              )}
            </p>

            {this.bountyContractStore.bountyContractInfo.role === USER_ROLE.FOUNDER && (
              <UButton
                secondary={!this.payBtnAbled}
                disabled={!this.payBtnAbled}
                class={`h-9 w-30 font-primary font-semibold  -mr-8 px-8 ${
                  !this.payBtnAbled
                    ? 'text-[#FFFFFF]'
                    : 'text-[#3F2D99] border-1 border-[#3F2D99] border-solid rounded-sm !hover:text-[#3F2D99]'
                }`}
                color={!this.payBtnAbled ? 'rgba(0,0,0,0.1)' : '#FFFFFF'}
                type="default"
                size="small"
                onClick={triggerDialog}
              >
                Pay
              </UButton>
            )}
          </div>

          <div class="mt-4 font-primary text-color2 text-thin">{this.item.terms}</div>
        </div>
      </>
    )
  }
})
