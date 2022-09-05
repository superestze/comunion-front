import { UButton, UCard, UModal } from '@comunion/components'
import { WarningFilled } from '@comunion/icons'
import dayjs from 'dayjs'
import { defineComponent, onMounted, PropType, reactive, ref } from 'vue'
import { BasicInfo } from './components/BasicInfo'
import { Vote } from './components/Vote'
import { ProposalInfo } from './typing'
import { StepProps } from '@/components/Step'
import { services } from '@/services'
import { useWalletStore } from '@/stores'
import { getClient } from '@/utils/ipfs'

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
    const startupOptions = ref()
    const walletStore = useWalletStore()
    const basicInfoRef = ref()
    const voteRef = ref()
    const modalVisibleState = ref(false)
    const ipfsClient = getClient()
    const proposalInfo = reactive<ProposalInfo>({
      current: 1,
      vote: 1,
      voteChoices: [{ value: '' }, { value: '' }],
      startTime: undefined,
      endTime: undefined
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
      if (proposalInfo.current === 1) {
        // basicInfoRef.value?.proposalBasicInfoForm?.validate((error: any) => {
        //   if (!error) {
        //     proposalInfo.current += 1
        //   }
        // })
      }
    }
    const getStartupsOptions = async () => {
      try {
        const { error, data } = await services['account@related-statups']()
        console.log('data==>', data)

        if (!error) {
          startupOptions.value = data.map(item => ({
            value: item.startupId,
            label: item.startupName
          }))
        }
      } catch (error) {
        console.error('error===>', error)
      }
    }
    onMounted(() => {
      getStartupsOptions()
    })
    const onSubmit = async () => {
      // validate
      voteRef.value?.proposalVoteFormRef?.validate(async (error: any) => {
        console.log('error==>', error)

        if (!error) {
          //
          const startupInfo = startupOptions.value.find(
            (startup: { value: number | undefined }) => startup.value === proposalInfo.startupId
          )
          const signature = await walletStore.wallet?.sign(
            JSON.stringify({
              From: walletStore.address,
              Startup: startupInfo?.value,
              Timestamp: dayjs().valueOf(),
              Type: proposalInfo.vote,
              Title: proposalInfo.title,
              Descraption: proposalInfo.description,
              Discussion: proposalInfo.discussion,
              Choice: proposalInfo.voteChoices.map(choice => choice.value),
              Start: dayjs(proposalInfo.startTime).utc().valueOf(),
              End: dayjs(proposalInfo.endTime).utc().valueOf(),
              'Block Height': walletStore.wallet.getProvider().blockNumber
            })
          )
          console.log('signature===>', signature)
          if (signature) {
            const { cid, path } = await ipfsClient.add(signature)
            console.log('cid==>', cid)
            console.log('path==>', path)
          }
        }
      })
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
      basicInfoRef,
      voteRef,
      closeDrawer
    }
  },
  render() {
    return (
      <div>
        <div>
          {this.proposalInfo.current === 1 && (
            <BasicInfo
              proposalInfo={this.proposalInfo}
              ref={(ref: any) => (this.basicInfoRef = ref)}
            />
          )}
          {this.proposalInfo.current === 2 && (
            <Vote proposalInfo={this.proposalInfo} ref={(ref: any) => (this.voteRef = ref)} />
          )}
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
