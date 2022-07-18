import { message, UButton, UDrawer } from '@comunion/components'
import { defineComponent, ref } from 'vue'
import CreateCrowdfundingForm from './CreateForm'
import { CrowdfundingFormRef } from './typing.d'
import { useWalletStore } from '@/stores'

export type CreateCrowdfundingRef = {
  show: () => void
  close: () => void
}

const CreateCrowdfundingBlock = defineComponent({
  name: 'CreateCrowdfundingBlock',
  setup() {
    const createCrowdfundingFormRef = ref<CrowdfundingFormRef>()
    const visible = ref(false)
    const walletStore = useWalletStore()

    const show = async () => {
      await walletStore.ensureWalletConnected()
      if (!walletStore.isNetworkSupported) {
        message.warning('Please switch to the supported network to create a bounty')
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
      createCrowdfundingFormRef.value?.showLeaveTipModal?.()
    }

    const stepOptions = [
      { name: 'Verify Token And Select Startup' },
      { name: 'The Crowdfunding Information ' },
      { name: 'Add Additional Information ' },
      { name: 'Review Your Information' }
    ]

    const footer = () => {
      console.log(
        'createCrowdfundingFormRef.value==>',
        createCrowdfundingFormRef.value?.crowdfundingInfo
      )

      return (
        <div class="text-right pr-16 pb-4 bg-purple">
          {createCrowdfundingFormRef.value?.crowdfundingInfo?.current === 1 && (
            <UButton class="w-40 mr-4" type="primary" ghost onClick={closeCrowdfunding}>
              Cancel
            </UButton>
          )}
          {(createCrowdfundingFormRef.value?.crowdfundingInfo?.current as number) > 1 && (
            <UButton
              class="w-40 mr-4"
              type="primary"
              ghost
              onClick={createCrowdfundingFormRef.value?.toPreviousStep}
            >
              Previous Step
            </UButton>
          )}
          {(createCrowdfundingFormRef.value?.crowdfundingInfo?.current as number) <
            stepOptions.length && (
            <UButton type="primary" class="w-40" onClick={createCrowdfundingFormRef.value?.toNext}>
              Next
            </UButton>
          )}
          {createCrowdfundingFormRef.value?.crowdfundingInfo?.current === stepOptions.length && (
            <UButton
              type="primary"
              class="w-40"
              onClick={createCrowdfundingFormRef.value?.onSubmit}
            >
              Submit
            </UButton>
          )}
        </div>
      )
    }

    return { show, close, visible, footer, createCrowdfundingFormRef, stepOptions }
  },
  render() {
    return (
      <UDrawer
        title="Create Crowdfunding"
        maskClosable={false}
        v-model:show={this.visible}
        v-slots={{
          whiteBoard: this.footer
        }}
      >
        {this.visible && (
          <CreateCrowdfundingForm
            ref={(ref: any) => (this.createCrowdfundingFormRef = ref)}
            stepOptions={this.stepOptions}
            onCancel={this.close}
          />
        )}
      </UDrawer>
    )
  }
})

export default CreateCrowdfundingBlock
