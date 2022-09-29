import { UButton, UCard, UModal } from '@comunion/components'
import { WarningFilled } from '@comunion/icons'
import dayjs from 'dayjs'
import { ethers } from 'ethers'
import { defineComponent, PropType, reactive, ref, watch } from 'vue'
import { AdditionalInformation, AdditionalInformationRef } from './components/AdditionalInfomation'
import {
  CrowdfundingInformation,
  CrowdfundingInformationRef,
  MAIN_COIN_ADDR
} from './components/CrowdfundingInformation'
import { ReviewInfo } from './components/ReviewInfo'
import { VerifyTokenRef, VerifyToken } from './components/VerifyToken'
import { CrowdfundingInfo } from './typing'
import Steps, { StepProps } from '@/components/Step'
import {
  CrowdfundingFactoryAddresses,
  useCrowdfundingFactoryContract,
  useErc20Contract
} from '@/contracts'
import { services } from '@/services'
import { useWalletStore } from '@/stores'
import { useContractStore } from '@/stores/contract'
import { reportError } from '@/utils/sentry'

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
    const erc20TokenContract = useErc20Contract()
    const crowdfundingContract = useCrowdfundingFactoryContract()
    const verifyTokenRef = ref<VerifyTokenRef>()
    const fundingInfoRef = ref<CrowdfundingInformationRef>()
    const additionalInfoRef = ref<AdditionalInformationRef>()
    const modalVisibleState = ref(false)
    const toNextProcessing = ref(false)
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
      buyTokenName: '',
      buyTokenSymbol: '',
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
    watch(
      () => crowdfundingInfo.startupId,
      () => {
        getFinanceSymbol(crowdfundingInfo.startupId)
      }
    )
    const getFinanceSymbol = async (startupId?: number) => {
      const { error, data } = await services['startup@startup-get']({
        startupId
      })
      if (!error) {
        netWorkChange(data.chainID)
      }
    }
    const netWorkChange = async (value: number) => {
      if (walletStore.chainId !== value) {
        await walletStore.ensureWalletConnected()
        const result = await walletStore.wallet?.switchNetwork(value)
        if (!result) {
          closeDrawer()
        }
      }
    }
    const showLeaveTipModal = () => {
      modalVisibleState.value = true
    }
    const toPreviousStep = () => {
      crowdfundingInfo.current -= 1
    }
    const toNext = () => {
      if (toNextProcessing.value) {
        return
      }
      toNextProcessing.value = true
      if (crowdfundingInfo.current === 1) {
        verifyTokenRef.value?.verifyTokenForm?.validate(error => {
          toNextProcessing.value = false
          if (!error) {
            crowdfundingInfo.current += 1
          }
        })
      } else if (crowdfundingInfo.current === 2) {
        fundingInfoRef.value?.crowdfundingInfoForm?.validate(error => {
          toNextProcessing.value = false
          if (!error) {
            crowdfundingInfo.current += 1
          }
        })
      } else if (crowdfundingInfo.current === 3) {
        additionalInfoRef.value?.additionalInfoForm?.validate(error => {
          toNextProcessing.value = false
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
      const approvePendingText = 'Apply for creating dCrowdfunding contract on blockchain.'
      try {
        // convert data to wei unit
        const raiseGoalTotal = ethers.utils.parseUnits(
          crowdfundingInfo.sellTokenDeposit!.toString(),
          crowdfundingInfo.sellTokenDecimals
        )
        // get dcrowdfunding factory address
        const factoryAddress = CrowdfundingFactoryAddresses()
        contractStore.startContract(approvePendingText)
        // approve sellToken to crowdfund factory contract
        const erc20Res = await erc20TokenContract(crowdfundingInfo.sellTokenContract!)
        const approveRes = await erc20Res.approve(factoryAddress, raiseGoalTotal)
        await approveRes.wait()
        const contractRes: any = await crowdfundingContract.createCrowdfundingContract(
          crowdfundingInfo.sellTokenContract!,
          crowdfundingInfo.buyTokenContract === MAIN_COIN_ADDR
            ? crowdfundingInfo.sellTokenContract!
            : crowdfundingInfo.buyTokenContract,
          ethers.utils.parseUnits(
            crowdfundingInfo.raiseGoal!.toString(),
            crowdfundingInfo.sellTokenDecimals
          ),
          ethers.utils.parseUnits(
            crowdfundingInfo.buyPrice!.toString(),
            crowdfundingInfo.sellTokenDecimals
          ),
          ethers.utils.parseUnits(crowdfundingInfo.swapPercent!.toString(), 2),
          ethers.utils.parseUnits(crowdfundingInfo.sellTax!.toString(), 2),
          ethers.utils.parseUnits(crowdfundingInfo.maxBuyAmount!.toString(), 18),
          ethers.utils.parseUnits(crowdfundingInfo.maxSell!.toString(), 2),
          crowdfundingInfo.teamWallet,
          dayjs(crowdfundingInfo.startTime).valueOf() / 1000,
          dayjs(crowdfundingInfo.endTime).valueOf() / 1000,
          'Create dCrowdfunding contract on blockchain.',
          `dCrowdfunding is Creating`
        )
        return contractRes
      } catch (e: any) {
        reportError(e as Error)
        console.error(e)
        contractStore.endContract('failed', { success: false })
      }
      return null
    }
    const postSubmit = async () => {
      try {
        console.log(crowdfundingInfo)
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
          startTime: dayjs(crowdfundingInfo.startTime!).utc().toISOString(),
          endTime: dayjs(crowdfundingInfo.endTime!).utc().toISOString(),
          poster: crowdfundingInfo.poster.url,
          description: crowdfundingInfo.description!,
          sellTokenContract: crowdfundingInfo.sellTokenContract!,
          sellTokenSymbol: crowdfundingInfo.sellTokenSymbol!,
          maxSellPercent: crowdfundingInfo.maxSell!,
          buyTokenContract:
            crowdfundingInfo.buyTokenContract === MAIN_COIN_ADDR
              ? crowdfundingInfo.sellTokenContract!
              : crowdfundingInfo.buyTokenContract,
          buyTokenSymbol: crowdfundingInfo.buyTokenSymbol!,
          sellTokenDeposit: Number(crowdfundingInfo.sellTokenDeposit),
          ...dynamic
        })
        ctx.emit('cancel')
      } catch (error) {
        reportError(error as Error)
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
        <div class="mx-35 mb-20">
          <Steps
            steps={this.stepOptions}
            current={this.crowdfundingInfo.current}
            classes={{ stepTitle: 'w-32 text-center' }}
          />
        </div>
        {this.crowdfundingInfo.current === 1 && (
          <VerifyToken
            crowdfundingInfo={this.crowdfundingInfo}
            onCloseDrawer={this.closeDrawer}
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
            onClose={() => (this.modalVisibleState = false)}
            v-slots={{
              header: () => {
                return (
                  <div class="flex relative items-center">
                    <WarningFilled class="mr-4" />{' '}
                    <span class="text-color1 u-h3">Discard the changes?</span>
                  </div>
                )
              }
            }}
          >
            <div class="min-h-20 p-4 text-color2 u-h6">
              The action cannot be undone at once you click 'Yes'!
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
      </div>
    )
  }
})

export default CreateCrowdfundingForm
