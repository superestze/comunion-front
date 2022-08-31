import { UButton, UCard, UModal } from '@comunion/components'
import { WarningFilled } from '@comunion/icons'
import { defineComponent, PropType, reactive, ref } from 'vue'
import { Vote } from './components/Vote'
import { BasicInfo } from './components/basicInfo'
import { ProposalInfo } from './typing'
import { StepProps } from '@/components/Step'

const CreateProposalFrom = defineComponent({
  name: 'CreateCrowdfundingForm',
  emits: ['cancel'],
  props: {
    stepOptions: {
      type: Array as PropType<StepProps[]>,
      required: true
    }
  },
  setup(props, ctx) {
    const modalVisibleState = ref(false)
    const proposalInfo = reactive<ProposalInfo>({
      current: 1,
      vote: 1,
      voteChoices: ['']
    })
    const showLeaveTipModal = () => {
      modalVisibleState.value = true
    }
    const toPreviousStep = () => {
      proposalInfo.current -= 1
    }
    const closeDrawer = () => {
      modalVisibleState.value = false
      ctx.emit('cancel')
    }
    const toNext = () => {
      proposalInfo.current += 1
    }
    const onSubmit = () => {
      //
    }
    ctx.expose({
      proposalInfo,
      toPreviousStep,
      toNext,
      showLeaveTipModal,
      closeDrawer,
      onSubmit
    })
    return {
      proposalInfo,
      modalVisibleState,
      closeDrawer
    }
  },
  render() {
    return (
      <div>
        <div>
          {this.proposalInfo.current === 1 && <BasicInfo proposalInfo={this.proposalInfo} />}
          {this.proposalInfo.current === 2 && <Vote proposalInfo={this.proposalInfo} />}
        </div>
        <UModal v-model:show={this.modalVisibleState} maskClosable={false}>
          <UCard
            style={{ width: '540px' }}
            closable={true}
            class="!p-7"
            onClose={() => (this.modalVisibleState = false)}
          >
            <div class="relative -top-3 flex items-center">
              <WarningFilled /> <span class="u-title1 ml-4">Discard changes?</span>
            </div>
            <div class="mt-3 ml-12 u-body2">
              This can’t be undone and you’ll lose your changes.{' '}
            </div>
            <div class="flex justify-end mt-20">
              <UButton
                type="primary"
                ghost
                class="w-41 mr-4"
                onClick={() => (this.modalVisibleState = false)}
              >
                Cancel
              </UButton>
              <UButton type="primary" class="w-41" onClick={this.closeDrawer}>
                Yes
              </UButton>
            </div>
          </UCard>
        </UModal>
      </div>
    )
  }
})

export default CreateProposalFrom
