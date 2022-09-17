import { UButton } from '@comunion/components'
import { defineComponent, ref, computed } from 'vue'
import { AddDepositDialog } from '../Dialog'
import { BOUNTY_STATUS } from '@/constants'
import { useBountyContractStore } from '@/stores/bountyContract'
import { checkSupportNetwork } from '@/utils/wallet'

export default defineComponent({
  props: {
    detailChainId: {
      type: Number,
      default: () => 0
    }
  },
  setup() {
    const visible = ref<boolean>(false)
    const bountyContractStore = useBountyContractStore()
    const disabled = computed(() => {
      return (
        bountyContractStore.bountyContractInfo.bountyStatus >= BOUNTY_STATUS.WORKSTARTED ||
        bountyContractStore.dontContract
      )
    })
    return {
      visible,
      disabled
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
    return (
      <>
        <AddDepositDialog
          detailChainId={this.detailChainId}
          visible={this.visible}
          onTriggerDialog={triggerDialog}
        />
        <UButton
          class={`${this.$attrs.class}`}
          ghost
          disabled={this.disabled}
          onClick={triggerDialog}
          size="small"
        >
          + Deposit
        </UButton>
      </>
    )
  }
})
