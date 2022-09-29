import { UButton } from '@comunion/components'
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
    }
  },
  setup() {
    const route = useRoute()
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
      chainId,
      route
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
        'Release succeedes'
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
        <UButton
          class={`${this.$attrs.class}`}
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
