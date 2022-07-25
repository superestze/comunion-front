import dayjs from 'dayjs'
import { defineComponent, PropType } from 'vue'
import { CrowdfundingInfo } from '../typing'

import './reviewInfo.css'

export const ReviewInfo = defineComponent({
  name: 'ReviewInfo',
  props: {
    crowdfundingInfo: {
      type: Object as PropType<CrowdfundingInfo>,
      required: true
    }
  },
  render() {
    return (
      <div class="review-info grid grid-cols-[220px,1fr]">
        <div class="title">Startup:</div>
        <div>{this.crowdfundingInfo.startupName}</div>
        <div class="title">Token Contract :</div>
        <div>{this.crowdfundingInfo.sellTokenContract}</div>
        <div class="title">Team Wallet Address :</div>
        <div>{this.crowdfundingInfo.teamWallet}</div>
        <div class="title">Raise Goal :</div>
        <div>
          {this.crowdfundingInfo.raiseGoal} {this.crowdfundingInfo.buyTokenName}
        </div>
        <div class="title">Tokens For Crowdfunding :</div>
        <div>
          {this.crowdfundingInfo.buyPrice! * this.crowdfundingInfo.raiseGoal!}{' '}
          {this.crowdfundingInfo.sellTokenName}
        </div>
        <div class="title">Swap :</div>
        <div>{this.crowdfundingInfo.swapPercent}%</div>
        <div class="title">IBO Rate :</div>
        <div>
          1 {this.crowdfundingInfo.buyTokenName} = {this.crowdfundingInfo.buyPrice}{' '}
          {this.crowdfundingInfo.sellTokenName}
        </div>
        <div class="title">Maximum Buy :</div>
        <div>
          {this.crowdfundingInfo.maxBuyAmount} {this.crowdfundingInfo.buyTokenName}
        </div>
        <div class="title">Sell Rate :</div>
        <div>
          1 {this.crowdfundingInfo.buyTokenName} = {this.crowdfundingInfo.sellTax}{' '}
          {this.crowdfundingInfo.sellTokenName}
        </div>
        <div class="title">Maximum Sell :</div>
        <div>{this.crowdfundingInfo.maxSell} % of the bought token amount</div>
        <div class="title">Crowdfunding Start Time :</div>
        <div>{dayjs(this.crowdfundingInfo.startTime).format('YYYY-MM-DD HH:mm:ss')}</div>
        <div class="title">Crowdfunding End Time :</div>
        <div>{dayjs(this.crowdfundingInfo.endTime).format('YYYY-MM-DD HH:mm:ss')}</div>
        {!!this.crowdfundingInfo.youtube && <div class="title">Youtube :</div>}
        {!!this.crowdfundingInfo.youtube && <a>{this.crowdfundingInfo.youtube}</a>}
        {!!this.crowdfundingInfo.detail && <div class="title">Crowdfunding detail :</div>}
        {!!this.crowdfundingInfo.detail && <a>{this.crowdfundingInfo.detail}</a>}
      </div>
    )
  }
})
