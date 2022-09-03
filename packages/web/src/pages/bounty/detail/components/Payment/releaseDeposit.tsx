import { UButton } from '@comunion/components'
import { defineComponent, ref, computed } from 'vue'
import {
  BountyContractReturnType,
  useBountyContractWrapper
} from '../../hooks/useBountyContractWrapper'
import { BasicDialog } from '../Dialog'
import { BOUNTY_STATUS } from '@/constants'
import { services } from '@/services'
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
    const { bountyContract, chainId } = useBountyContractWrapper()
    const { release } = bountyContract
    const bountyContractStore = useBountyContractStore()

    const disabled = computed(() => {
      return (
        bountyContractStore.bountyContractInfo.depositLock ||
        bountyContractStore.bountyContractInfo.bountyStatus >= BOUNTY_STATUS.COMPLETED ||
        bountyContractStore.dontContract
      )
    })
    return {
      visible,
      release,
      disabled,
      chainId
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
        'Waiting to submit all contents to blockchain for release',
        'Release succeedes'
      )) as unknown as BountyContractReturnType
      const { error } = await services['bounty@bounty-release']({
        bountyID: parseInt(this.$route.query.bountyId as string),
        chainID: this.chainId,
        TxHash: response.hash
      })
      if (!error) {
        triggerDialog()
      }
    }
    return (
      <>
        <BasicDialog
          visible={this.visible}
          title="Release deposit？"
          content=" All deposits will be released."
          onTriggerDialog={triggerDialog}
          v-slots={{
            btns: () => (
              <div class="flex justify-end mt-80px">
                <UButton
                  type="default"
                  class="w-164px mr-16px"
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
        <UButton
          class="w-37"
          type="primary"
          disabled={this.disabled}
          onClick={triggerDialog}
          size="small"
        >
          Release
        </UButton>
      </>
    )
  }
})
