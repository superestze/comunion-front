import { message, UButton, UCard, UModal, USpin } from '@comunion/components'
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
import { reportError } from '@/utils/sentry'

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
    const proposalInfo: ProposalInfo = reactive<ProposalInfo>({ ...props.defaultProposalInfo })
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
            proposalInfo.current = 2
          }
        })
      }
    }
    const getStartupsOptions = async () => {
      try {
        const { error, data } = await services['account@related-statups']()

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
        if (!error) {
          voteOptions.value = data.map(item => ({
            label: item.dictLabel as string,
            value: item.dictLabel as string,
            key: item.seqNum,
            remark: item.remark
          }))
        }
      } catch (error) {
        //
      }
    }

    const submitLoading = ref(false)

    const onSubmit = async () => {
      // validate
      voteRef.value?.proposalVoteFormRef?.validate(async (error: any) => {
        if (!error) {
          //
          const startupInfo = startupOptions.value.find(
            (startup: { value: number | undefined }) => startup.value === proposalInfo.startupId
          )
          const blockNumber = walletStore.wallet?.getProvider().blockNumber

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
            Description: proposalInfo.description || '',
            Discussion: proposalInfo.discussion || '',
            BlockHeight: blockNumber
          }

          submitLoading.value = true
          try {
            const signature = await walletStore.wallet?.signTypedData(
              domain,
              signerProposalTypes,
              saveContent
            )

            // sign(JSON.stringify(saveContent, null, 2))
            if (signature) {
              const ipfsClientRes: any = await ipfsClient
                .add(
                  JSON.stringify({
                    address: walletStore.address,
                    data: saveContent,
                    sig: signature
                  })
                )
                .catch(err => {
                  console.warn('ipfsClientRes=', err)
                  message.warning(err.message)
                  submitLoading.value = false
                })
              if (!ipfsClientRes) {
                return null
              }
              const reqParams = {
                authorComerId: userInfo.profile!.comerID!,
                authorWalletAddress: walletStore.address!,
                chainId: walletStore.chainId!,
                blockNumber: blockNumber!,
                releaseTimestamp: dayjs().utc().toISOString(),
                ipfsHash: ipfsClientRes.cid.toString(),
                title: proposalInfo.title!,
                startupId: proposalInfo.startupId,
                description: proposalInfo.description,
                discussionLink: proposalInfo.discussion,
                voteSystem: proposalInfo.vote,
                startTime: dayjs(proposalInfo.startTime!).utc().toISOString(),
                endTime: dayjs(proposalInfo.endTime!).utc().toISOString(),
                choices: (proposalInfo.voteChoices || [])
                  .filter((item: { value: string }) => item.value)
                  .map((choice, choiceIndex) => ({
                    itemName: choice.value,
                    seqNum: choiceIndex + 1
                  }))
              }

              const { error } = await services['governance@create-proposal'](reqParams)
              if (error) {
                submitLoading.value = false
                return reportError(new Error('create proposal'), reqParams)
              }
              submitLoading.value = false
              message.success('Create proposal successfully')
              closeDrawer()
            }
          } catch (error) {
            submitLoading.value = false
            return reportError(error as Error)
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
      submitLoading,
      closeDrawer
    }
  },
  render() {
    return (
      <USpin show={this.submitLoading}>
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
        <UModal v-model:show={this.modalVisibleState} maskClosable={false}>
          <UCard
            style={{ width: '540px' }}
            closable={true}
            onClose={() => (this.modalVisibleState = false)}
            v-slots={{
              header: () => {
                return (
                  <div class="flex relative items-center">
                    <WarningFilled class="mr-4" />{' '}
                    <span class="text-color1 u-h3">Discard changes?</span>
                  </div>
                )
              }
            }}
          >
            <div class="min-h-20 p-4 text-color2 u-h6">
              This can’t be undone and you’ll lose your changes.
            </div>
            <div class="flex mt-4 justify-end">
              <UButton
                type="primary"
                ghost
                class="mr-4 w-41"
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
      </USpin>
    )
  }
})

export default CreateProposalFrom
