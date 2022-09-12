import { message, UButton, UCard, UModal } from '@comunion/components'
import { WarningFilled } from '@comunion/icons'
import dayjs from 'dayjs'
import { defineComponent, onMounted, PropType, reactive, ref } from 'vue'
import { BasicInfo } from './components/BasicInfo'
import { Vote } from './components/Vote'
import { ProposalInfo, VoteOption } from './typing'
import { StepProps } from '@/components/Step'
import { signerProposalTypes } from '@/pages/governance/utils'
import { services } from '@/services'
import { useUserStore, useWalletStore } from '@/stores'
import { getClient } from '@/utils/ipfs'

const CreateProposalFrom = defineComponent({
  name: 'CreateCrowdfundingForm',
  emits: ['cancel'],
  props: {
    stepOptions: {
      type: Array as PropType<StepProps[]>,
      required: true
    },
    defaultProposalInfo: {
      type: Object as PropType<ProposalInfo>,
      default: {
        current: 1,
        startupId: undefined,
        vote: 'Single choice voting',
        voteChoices: [{ value: '' }, { value: '' }],
        startTime: undefined,
        endTime: undefined
      }
    }
  },
  setup(props, ctx) {
    const walletStore = useWalletStore()
    const userInfo = useUserStore()
    const startupOptions = ref()
    const basicInfoRef = ref()
    const voteRef = ref()
    const voteOptions = ref<VoteOption[] | undefined>()
    const modalVisibleState = ref(false)
    const ipfsClient = getClient()
    const proposalInfo: ProposalInfo = reactive<ProposalInfo>(props.defaultProposalInfo)
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
      // proposalInfo.current += 1
      if (proposalInfo.current === 1) {
        basicInfoRef.value?.proposalBasicInfoForm?.validate((error: any) => {
          if (!error) {
            proposalInfo.current += 1
          }
        })
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
      getVoteTypeOptions()
      getStartupsOptions()
    })
    const getVoteTypeOptions = async () => {
      try {
        const { error, data } = await services['meta@dict-list-by-type']({ type: 'voteSystem' })
        console.log('data==>', data)
        if (!error) {
          voteOptions.value = data.map(item => ({
            label: item.dictLabel,
            value: item.dictLabel,
            key: item.seqNum,
            remark: item.remark
          }))
        }
      } catch (error) {
        //
      }
    }
    const onSubmit = async () => {
      // validate
      voteRef.value?.proposalVoteFormRef?.validate(async (error: any) => {
        console.log('error==>', error)

        if (!error) {
          //
          const startupInfo = startupOptions.value.find(
            (startup: { value: number | undefined }) => startup.value === proposalInfo.startupId
          )
          const blockNumber = walletStore.wallet?.getProvider().blockNumber
          // const voteType =
          //   voteOptions.value?.find(option => option.value === proposalInfo.vote)?.label || 'basic'

          const domain = { name: 'Comunion' }

          const saveContent = {
            From: walletStore.address,
            Startup: startupInfo?.label,
            Timestamp: dayjs().valueOf(),
            Type: proposalInfo.vote,
            Title: proposalInfo.title,
            Choice: proposalInfo.voteChoices?.map(choice => choice.value).filter(Boolean),
            Start: dayjs(proposalInfo.startTime).utc().valueOf(),
            End: dayjs(proposalInfo.endTime).utc().valueOf(),
            blockHeight: blockNumber
          }
          // const optionalContent = {
          //   Description: proposalInfo.description || '',
          //   Discussion: proposalInfo.discussion || ''
          // }

          const signature = await walletStore.wallet?.signTypedData(
            domain,
            signerProposalTypes,
            saveContent
          )

          // sign(JSON.stringify(saveContent, null, 2))
          console.log('signature===>', signature)
          if (signature) {
            const { cid } = await ipfsClient.add(
              JSON.stringify({
                address: walletStore.address,
                data: saveContent,
                sig: signature
              })
            )
            console.log('cid==>', cid)
            // console.log('path==>', path)

            const { error } = await services['governance@create-proposal']({
              authorComerId: userInfo.profile!.comerID!,
              authorWalletAddress: walletStore.address!,
              chainId: walletStore.chainId!,
              blockNumber: blockNumber!,
              releaseTimestamp: dayjs().utc().toISOString(),
              ipfsHash: cid.toString(),
              title: proposalInfo.title!,
              startupId: proposalInfo.startupId,
              description: proposalInfo.description,
              discussionLink: proposalInfo.discussion,
              voteSystem: proposalInfo.vote,
              startTime: dayjs(proposalInfo.startTime!).utc().toISOString(),
              endTime: dayjs(proposalInfo.endTime!).utc().toISOString(),
              choices: proposalInfo.voteChoices
                ?.filter((item: { value: string }) => item.value)
                .map((choice, choiceIndex) => ({
                  itemName: choice.value,
                  seqNum: choiceIndex + 1
                }))
            })
            if (!error) {
              message.success('Create proposal successfully')
              closeDrawer()
            }
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
      startupOptions,
      voteOptions,
      closeDrawer
    }
  },
  render() {
    return (
      <div>
        <div>
          {this.proposalInfo.current === 1 && (
            <BasicInfo
              startupOptions={this.startupOptions}
              proposalInfo={this.proposalInfo}
              ref={(ref: any) => (this.basicInfoRef = ref)}
            />
          )}
          {this.proposalInfo.current === 2 && (
            <Vote
              proposalInfo={this.proposalInfo}
              ref={(ref: any) => (this.voteRef = ref)}
              voteOptions={this.voteOptions}
            />
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
