import { UButton } from '@comunion/components'
import { defineComponent, ref, computed } from 'vue'
import { AddDepositDialog } from '../Dialog'
import { BOUNTY_STATUS } from '@/constants'
import { useBountyContractStore } from '@/stores/bountyContract'

export default defineComponent({
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
    const triggerDialog = () => {
      this.visible = !this.visible
    }
    return (
      <>
        <AddDepositDialog visible={this.visible} onTriggerDialog={triggerDialog} />
        <UButton
          class="w-37 mr-6"
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
