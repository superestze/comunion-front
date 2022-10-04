import { UButton, UTooltip } from '@comunion/components'
import { defineComponent, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  BountyContractReturnType,
  useBountyContractWrapper
} from '../../hooks/useBountyContractWrapper'
import { BasicDialog } from '../Dialog'
import { BOUNTY_STATUS } from '@/constants'
import { services } from '@/services'
import { useBountyStore } from '@/stores'
import { useBountyContractStore } from '@/stores/bountyContract'
import { checkSupportNetwork } from '@/utils/wallet'

export default defineComponent({
  props: {
    detailChainId: {
      type: Number,
      default: () => 0
    },
    bountyDetail: {
      type: Object,
      required: true,
      default: () => null
    },
    bountyContractInfo: {
      type: Object,
      default: () => null
    }
  },
  setup(props) {
    const route = useRoute()
    const visible = ref<boolean>(false)
    const { bountyContract, chainId } = useBountyContractWrapper()
    const { release } = bountyContract
    const bountyContractStore = useBountyContractStore()
    const bountyContractInfo = computed(() => {
      return bountyContractStore.bountyContractInfo
    })
    const bountyInfo = computed(() => {
      return props.bountyDetail
    })
    const disabled = computed(() => {
      return (
        bountyContractStore.bountyContractInfo.depositLock ||
        bountyContractStore.bountyContractInfo.bountyStatus >= BOUNTY_STATUS.COMPLETED ||
        bountyInfo.value.status === BOUNTY_STATUS.COMPLETED ||
        bountyContractStore.dontContract ||
        (bountyContractInfo.value.founderDepositAmount == 0 &&
          bountyContractInfo.value.applicantDepositAmount == 0)
      )
    })
    const disabledText = computed(() => {
      if (
        bountyContractInfo.value.founderDepositAmount == 0 &&
        bountyContractInfo.value.applicantDepositAmount == 0
      ) {
        return 'Note: Not any deposit is in the contract.'
      }
      return null
    })
    return {
      visible,
      release,
      disabled,
      chainId,
      route,
      disabledText
    }
  },
  render() {
    const triggerDialog = async () => {
      const isSupport = await checkSupportNetwork(this.detailChainId)
      if (!isSupport) {
        return
      }
      this.visible = !this.visible
    }
    const handleReleaseDeposit = async () => {
      const isSupport = await checkSupportNetwork(this.detailChainId)
      if (!isSupport) {
        return
      }
      const response = (await this.release(
        'The deposits are releasing.',
        'Successfully release.'
      )) as unknown as BountyContractReturnType
      const { error } = await services['bounty@bounty-release']({
        bountyID: parseInt(this.route.params.id as string),
        chainID: this.chainId,
        TxHash: response.hash
      })

      const bountyStore = useBountyStore()
      bountyStore.initialize(this.route.params.id as string)
      if (!error) {
        triggerDialog()
      }
    }
    return (
      <>
        <BasicDialog
          visible={this.visible}
          title="Release the deposit？"
          content="All deposits will be released at once you click 'Yes'."
          onTriggerDialog={triggerDialog}
          v-slots={{
            btns: () => (
              <div class="flex mt-10 justify-end">
                <UButton
                  type="default"
                  class="mr-16px w-164px"
                  size="small"
                  onClick={triggerDialog}
                >
                  Cancel
                </UButton>
                <UButton type="primary" class="w-164px" size="small" onClick={handleReleaseDeposit}>
                  Yes
                </UButton>
              </div>
            )
          }}
        />
        {this.disabledText ? (
          <UTooltip>
            {{
              trigger: () => (
                <div class={`${this.$attrs.class}`}>
                  <UButton
                    class={`${this.$attrs.class} w-full`}
                    type="primary"
                    disabled={true}
                    size="small"
                  >
                    Release
                  </UButton>
                </div>
              ),
              default: () => this.disabledText
            }}
          </UTooltip>
        ) : (
          <UButton
            class={`${this.$attrs.class}`}
            type="primary"
            disabled={this.disabled}
            onClick={triggerDialog}
            size="small"
          >
            Release
          </UButton>
        )}
      </>
    )
  }
})
