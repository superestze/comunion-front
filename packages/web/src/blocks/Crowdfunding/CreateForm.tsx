import { UButton, UCard, UModal } from '@comunion/components'
import { WarningFilled } from '@comunion/icons'
import dayjs from 'dayjs'
import { defineComponent, PropType, reactive, ref } from 'vue'
import { AdditionalInformation, AdditionalInformationRef } from './components/AdditionalInfomation'
import {
  CrowdfundingInformation,
  CrowdfundingInformationRef
} from './components/CrowdfundingInformation'
import { ReviewInfo } from './components/ReviewInfo'
import { VerifyTokenRef, VerifyToken } from './components/VerifyToken'
import { CrowdfundingInfo } from './typing'
import Steps, { StepProps } from '@/components/Step'
import { useCrowdfundingFactoryContract } from '@/contracts'
import { services } from '@/services'
import { useWalletStore } from '@/stores'
import { useContractStore } from '@/stores/contract'

const CreateCrowdfundingForm = defineComponent({
  name: 'CreateCrowdfundingForm',
  emits: ['cancel'],
  props: {
    stepOptions: {
      type: Array as PropType<StepProps[]>,
      required: true
    }
  },
  setup(props, ctx) {
    const walletStore = useWalletStore()
    const contractStore = useContractStore()
    const crowdfuningContract = useCrowdfundingFactoryContract()
    const verifyTokenRef = ref<VerifyTokenRef>()
    const fundingInfoRef = ref<CrowdfundingInformationRef>()
    const additionalInfoRef = ref<AdditionalInformationRef>()
    const modalVisibleState = ref(false)
    const crowdfundingInfo = reactive<CrowdfundingInfo>({
      current: 1,
      // first step
      startupId: undefined,
      startupName: '',
      sellTokenContract: '',
      sellTokenName: '',
      sellTokenSymbol: '',
      sellTokenDecimals: '',
      sellTokenSupply: '',
      teamWallet: '',
      // second step
      raiseGoal: null,
      buyTokenContract: '',
      swapPercent: undefined,
      buyPrice: undefined,
      maxBuyAmount: undefined,
      sellTax: undefined,
      maxSell: 100,
      startTime: undefined,
      endTime: undefined,
      sellTokenDeposit: 0,
      // third step
      poster: '',
      youtube: '',
      detail: '',
      description: undefined
    })
    const showLeaveTipModal = () => {
      modalVisibleState.value = true
    }
    const toPreviousStep = () => {
      crowdfundingInfo.current -= 1
    }
    const toNext = () => {
      if (crowdfundingInfo.current === 1) {
        verifyTokenRef.value?.verifyTokenForm?.validate(error => {
          if (!error) {
            crowdfundingInfo.current += 1
          }
        })
      } else if (crowdfundingInfo.current === 2) {
        fundingInfoRef.value?.crowdfundingInfoForm?.validate(error => {
          if (!error) {
            crowdfundingInfo.current += 1
          }
        })
      } else if (crowdfundingInfo.current === 3) {
        additionalInfoRef.value?.additionalInfoForm?.validate(error => {
          if (!error) {
            crowdfundingInfo.current += 1
          }
        })
      } else {
        return
      }
    }
    const closeDrawer = () => {
      modalVisibleState.value = false
      ctx.emit('cancel')
    }
    const contractSubmit = async () => {
      try {
        const contractRes: any = await crowdfuningContract.createCrowdfundingContract(
          crowdfundingInfo.sellTokenContract!,
          crowdfundingInfo.buyTokenContract,
          crowdfundingInfo.sellTokenDeposit,
          crowdfundingInfo.buyPrice!,
          crowdfundingInfo.swapPercent,
          crowdfundingInfo.sellTax,
          crowdfundingInfo.maxBuyAmount!,
          crowdfundingInfo.maxSell,
          crowdfundingInfo.teamWallet,
          'Waiting to submit all contents to blockchain for creating crowdfunding',
          `Crowdfunding is Creating`
        )
        return contractRes
      } catch (e: any) {
        console.error(e)
        contractStore.endContract('failed', { success: false })
      }
      return null
    }
    const postSubmit = async () => {
      try {
        const contractRes = await contractSubmit()
        console.log('contractRes==>', contractRes)

        if (!contractRes) return
        const dynamic: { youtube?: string; detail?: string } = {}
        if (crowdfundingInfo.youtube) {
          dynamic.youtube = crowdfundingInfo.youtube
        }
        if (crowdfundingInfo.detail) {
          dynamic.detail = crowdfundingInfo.detail
        }
        await services['crowdfunding@create-crowdfunding']({
          startupId: crowdfundingInfo.startupId!,
          chainId: walletStore.chainId!,
          txHash: contractRes.hash,
          teamWallet: crowdfundingInfo.teamWallet,
          raiseGoal: crowdfundingInfo.raiseGoal as number,
          swapPercent: crowdfundingInfo.swapPercent!,
          buyPrice: crowdfundingInfo.buyPrice!,
          sellTax: crowdfundingInfo.sellTax!,
          maxBuyAmount: crowdfundingInfo.maxBuyAmount!,
          startTime: dayjs(crowdfundingInfo.startTime!).toISOString(),
          endTime: dayjs(crowdfundingInfo.endTime!).toISOString(),
          poster: crowdfundingInfo.poster.url,
          description: crowdfundingInfo.description!,
          sellTokenContract: crowdfundingInfo.sellTokenContract!,
          maxSellPercent: crowdfundingInfo.maxSell!,
          buyTokenContract: crowdfundingInfo.buyTokenContract,
          sellTokenDeposit: crowdfundingInfo.sellTokenDeposit,
          ...dynamic
        })
        ctx.emit('cancel')
      } catch (error) {
        console.error('error===>', error)
      }
    }
    const onSubmit = async () => {
      // const value = new Big(bountyInfo.deposit).times(Math.pow(10, 18)).toNumber()
      postSubmit()
    }
    ctx.expose({
      crowdfundingInfo,
      toPreviousStep,
      toNext,
      showLeaveTipModal,
      closeDrawer,
      onSubmit
    })
    return {
      crowdfundingInfo,
      modalVisibleState,
      verifyTokenRef,
      fundingInfoRef,
      additionalInfoRef,
      closeDrawer
    }
  },
  render() {
    return (
      <div>
        <div class="mb-20 mx-35">
          <Steps
            steps={this.stepOptions}
            current={this.crowdfundingInfo.current}
            classes={{ stepTitle: 'w-32 text-center' }}
          />
        </div>
        {this.crowdfundingInfo.current === 1 && (
          <VerifyToken
            crowdfundingInfo={this.crowdfundingInfo}
            ref={(value: any) => (this.verifyTokenRef = value)}
          />
        )}
        {this.crowdfundingInfo.current === 2 && (
          <CrowdfundingInformation
            crowdfundingInfo={this.crowdfundingInfo}
            ref={(value: any) => (this.fundingInfoRef = value)}
          />
        )}
        {this.crowdfundingInfo.current === 3 && (
          <AdditionalInformation
            crowdfundingInfo={this.crowdfundingInfo}
            ref={(value: any) => (this.additionalInfoRef = value)}
          />
        )}
        {this.crowdfundingInfo.current === 4 && (
          <ReviewInfo crowdfundingInfo={this.crowdfundingInfo} />
        )}
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
                size="large"
                type="primary"
                ghost
                class="w-41 mr-4"
                onClick={() => (this.modalVisibleState = false)}
              >
                Cancel
              </UButton>
              <UButton size="large" type="primary" class="w-41" onClick={this.closeDrawer}>
                Yes
              </UButton>
            </div>
          </UCard>
        </UModal>
      </div>
    )
  }
})

export default CreateCrowdfundingForm
