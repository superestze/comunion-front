import { UButton, UTooltip } from '@comunion/components'
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
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
    const route = useRoute()
    const visible = ref<boolean>(false)
    const { bountyContract, chainId } = useBountyContractWrapper()
    const { releaseMyDeposit } = bountyContract
    return {
      visible,
      releaseMyDeposit,
      chainId,
      route
    }
  },
  render() {
    const releaseMyDeposit = async () => {
      const isSupport = await checkSupportNetwork(this.detailChainId)
      if (!isSupport) {
        return
      }
      const response = (await this.releaseMyDeposit(
        'Note: Waiting to submit all contents to blockchain for release my deposit',
        'Release my deposit succeedes'
      )) as unknown as BountyContractReturnType
      await services['bounty@bounty-release-my-deposit']({
        bountyID: this.route.params.id as string,
        chainID: this.chainId,
        txHash: response.hash
      })

      const bountyStore = useBountyStore()
      bountyStore.initialize(this.route.params.id as string)
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
              <div class="flex mt-10 justify-end">
                <UButton
                  type="default"
                  class="mr-16px w-164px"
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
        {this.disabled ? (
          <UTooltip
            trigger="hover"
            placement="top"
            v-slots={{
              trigger: () => (
                <div class={`w-[100%]`}>
                  <UButton
                    type={'tertiary'}
                    class={`w-[100%] ${this.$attrs.class}`}
                    disabled={this.disabled}
                  >
                    Release my deposit
                  </UButton>
                </div>
              ),
              default: () => 'Note:Not any deposit is in the contract.'
            }}
          />
        ) : (
          // <UButton type={'tertiary'} class={`${this.$attrs.class}`} disabled={this.disabled}>
          //   Release my deposit
          // </UButton>
          <UButton
            type={'primary'}
            class={`${this.$attrs.class}`}
            onClick={triggerDialog}
            disabled={this.disabled}
          >
            Release my deposit
          </UButton>
        )}
      </>
    )
  }
})
