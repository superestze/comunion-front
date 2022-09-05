import { message, UButton, UDrawer } from '@comunion/components'
import { defineComponent, ref } from 'vue'
import CreateProposalForm from './CreateForm'
import { CreateProposalFormRef } from './typing.d'
import { useWalletStore } from '@/stores'

export type CreateProposalRef = {
  show: () => void
  close: () => void
}

const CreateProposalBlock = defineComponent({
  name: 'CreateProposalBlock',
  setup() {
    const createCreateProposalInfo = ref<CreateProposalFormRef>()
    const visible = ref(false)
    const walletStore = useWalletStore()

    const show = async () => {
      await walletStore.ensureWalletConnected()
      if (!walletStore.isNetworkSupported) {
        message.warning('Please switch to the supported network to create a proposal')
        // not supported network, try to switch
        walletStore.openNetworkSwitcher()
      } else {
        visible.value = true
      }
    }

    const close = () => {
      visible.value = false
    }

    const closeCrowdfunding = () => {
      createCreateProposalInfo.value?.showLeaveTipModal?.()
    }

    const stepOptions = [{ name: '' }, { name: '' }]

    const footer = () => {
      return (
        <div class="text-right pr-16 pb-4 bg-purple">
          {createCreateProposalInfo.value?.proposalInfo.current === 1 && (
            <UButton class="w-40 mr-4" type="primary" ghost onClick={closeCrowdfunding}>
              Cancel
            </UButton>
          )}
          {(createCreateProposalInfo.value?.proposalInfo.current as number) > 1 && (
            <UButton
              class="w-40 mr-4"
              type="primary"
              ghost
              onClick={createCreateProposalInfo.value?.toPreviousStep}
            >
              Previous Step
            </UButton>
          )}
          {(createCreateProposalInfo.value?.proposalInfo.current as number) <
            stepOptions.length && (
            <UButton type="primary" class="w-40" onClick={createCreateProposalInfo.value?.toNext}>
              Next
            </UButton>
          )}
          {createCreateProposalInfo.value?.proposalInfo.current === stepOptions.length && (
            <UButton type="primary" class="w-40" onClick={createCreateProposalInfo.value?.onSubmit}>
              Submit
            </UButton>
          )}
        </div>
      )
    }

    return { show, close, visible, footer, createCreateProposalInfo, stepOptions }
  },
  render() {
    return (
      <UDrawer
        title="Create Proposal"
        maskClosable={false}
        v-model:show={this.visible}
        v-slots={{
          whiteBoard: this.footer
        }}
      >
        <div class="-mt-5">
          {this.visible && (
            <CreateProposalForm
              ref={(ref: any) => (this.createCreateProposalInfo = ref)}
              stepOptions={this.stepOptions}
              onCancel={this.close}
            />
          )}
        </div>
      </UDrawer>
    )
  }
})

export default CreateProposalBlock
