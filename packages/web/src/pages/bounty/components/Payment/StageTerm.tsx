import { UButton, UTooltip } from '@comunion/components'
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
          return `${props.item.seqNum}th`
        } else if (props.item.seqNum === 3) {
          return '3rd'
        } else if (props.item.seqNum === 2) {
          return '2nd'
        } else if (props.item.seqNum === 1) {
          return '1st'
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

        <div class="border rounded-sm bg-[#F5F6FA] border-[#D5CFF4] mb-6 py-6 px-16 relative">
          {this.item?.status === 2 && <PayedMask />}

          <span class="rounded-br-md bg-[#D5CFF4] text-primary py-1 px-4 top-[-1px] left-[-1px] absolute u-h4">
            {this.flagStr}
          </span>

          <div class="flex items-center">
            <p class="flex-1 text-primary">
              <span class="u-h2">{this.item.token1Amount || 0}</span>
              <span class="ml-2 u-h6">{this.item.token1Symbol}</span>
              {this.item.token2Amount && (
                <span>
                  <span class="font-sans mx-2 text-24px">+</span>
                  <span class="u-h2">{this.item.token2Amount}</span>
                  <span class="ml-2 u-h6">{this.item.token2Symbol}</span>
                </span>
              )}
            </p>

            {this.bountyContractStore.bountyContractInfo.role === USER_ROLE.FOUNDER &&
              (this.payBtnAbled ? (
                <UButton
                  class={`h-9 w-30 font-primary font-semibold  -mr-8 px-8 text-primary border-1 border-[#5331F4] border-solid rounded-sm !hover:text-primary`}
                  type="default"
                  size="small"
                  onClick={triggerDialog}
                >
                  Pay
                </UButton>
              ) : (
                <UTooltip>
                  {{
                    trigger: () => (
                      <div>
                        <UButton
                          disabled
                          class={`h-9 w-30 font-primary font-semibold  -mr-8 px-8 text-[#FFFFFF]`}
                          color={'rgba(0,0,0,0.1)'}
                          type="default"
                          size="small"
                        >
                          Pay
                        </UButton>
                      </div>
                    ),
                    default: () =>
                      'Note: The pay button will be actived after the applicant is approvied.'
                  }}
                </UTooltip>
              ))}
          </div>

          <div class="font-primary mt-4 text-thin text-color2">{this.item.terms}</div>
        </div>
      </>
    )
  }
})
