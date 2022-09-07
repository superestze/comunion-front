import { UButton } from '@comunion/components'
import { defineComponent, ref } from 'vue'
import {
  BountyContractReturnType,
  useBountyContractWrapper
} from '../../hooks/useBountyContractWrapper'
import { BasicDialog } from '../Dialog'
import { services } from '@/services'
import { useBountyStore } from '@/stores'
import { checkSupportNetwork } from '@/utils/wallet'

export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      require: true
    },
    detailChainId: {
      type: Number,
      default: () => 0
    }
  },
  setup() {
    const visible = ref<boolean>(false)
    const { bountyContract, chainId } = useBountyContractWrapper()
    const { releaseMyDeposit } = bountyContract
    return {
      visible,
      releaseMyDeposit,
      chainId
    }
  },
  render() {
    const releaseMyDeposit = async () => {
      const isSupport = await checkSupportNetwork(this.detailChainId)
      if (!isSupport) {
        return
      }
      const response = (await this.releaseMyDeposit(
        'Waiting to submit all contents to blockchain for release my deposit',
        'Release my deposit succeedes'
      )) as unknown as BountyContractReturnType
      await services['bounty@bounty-release-my-deposit']({
        bountyID: this.$route.query.bountyId as string,
        chainID: this.chainId,
        txHash: response.hash
      })

      const bountyStore = useBountyStore()
      bountyStore.initialize(this.$route.query.bountyId as string)
      triggerDialog()
    }
    const triggerDialog = async () => {
      const isSupport = await checkSupportNetwork(this.detailChainId)
      if (!isSupport) {
        return
      }
      this.visible = !this.visible
    }
    return (
      <>
        <BasicDialog
          visible={this.visible}
          title="Release your deposits ？"
          content="All deposits will be released to your wallet, meanwhile your application will be canceled."
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
                <UButton type="primary" class="w-164px" size="small" onClick={releaseMyDeposit}>
                  Yes
                </UButton>
              </div>
            )
          }}
        />
        <UButton
          type={this.disabled ? 'tertiary' : 'primary'}
          class="w-321px mt-60px mb-48px mx-auto"
          onClick={triggerDialog}
          disabled={this.disabled}
        >
          Release my deposit
        </UButton>
      </>
    )
  }
})
