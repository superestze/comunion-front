import { defineComponent, PropType, reactive } from 'vue'
import { AdditionalInformation } from './components/AdditionalInfomation'
import { CrowdfundingInformation } from './components/CrowdfundingInformation'
import { ReviewInfo } from './components/ReviewInfo'
import { VerifyToken } from './components/VerifyToken'
import { CrowdfundingInfo } from './typing'
import Steps, { StepProps } from '@/components/Step'

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
    const crowdfundingInfo = reactive<CrowdfundingInfo>({
      current: 1,
      // first step
      startupId: undefined,
      sellTokenContract: '',
      sellTokenName: '',
      sellTokenSymbol: '',
      sellTokenDecimals: '',
      sellTokenSupply: '',
      teamWallet: '',
      // second step
      raiseGoal: undefined,
      buyTokenContract: '',
      swapPercent: undefined,
      buyPrice: '',
      maxBuyAmount: '',
      sellTax: '',
      maxSell: '',
      startTime: '',
      endTime: '',
      sellTokenDeposit: '',
      // third step
      poster: '',
      youtube: '',
      detail: '',
      description: ''
    })
    const toPreviousStep = () => {
      crowdfundingInfo.current -= 1
    }
    const toNext = () => {
      crowdfundingInfo.current += 1
    }
    ctx.expose({
      crowdfundingInfo,
      toPreviousStep,
      toNext
    })
    return {
      crowdfundingInfo
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
          <VerifyToken crowdfundingInfo={this.crowdfundingInfo} />
        )}
        {this.crowdfundingInfo.current === 2 && (
          <CrowdfundingInformation crowdfundingInfo={this.crowdfundingInfo} />
        )}
        {this.crowdfundingInfo.current === 3 && (
          <AdditionalInformation crowdfundingInfo={this.crowdfundingInfo} />
        )}
        {this.crowdfundingInfo.current === 4 && (
          <ReviewInfo crowdfundingInfo={this.crowdfundingInfo} />
        )}
      </div>
    )
  }
})

export default CreateCrowdfundingForm
