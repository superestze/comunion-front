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
      <div class="review-info">
        <div class="review-info-item">
          <div class="title">Startup:</div>
          <div>{this.crowdfundingInfo.startupName}</div>
        </div>
        <div class="review-info-item">
          <div class="title">Token Contract :</div>
          <div>{this.crowdfundingInfo.sellTokenContract}</div>
        </div>
        <div class="review-info-item">
          <div class="title">Team Wallet Address :</div>
          <div>{this.crowdfundingInfo.teamWallet}</div>
        </div>
        <div class="review-info-item">
          <div class="title">Raise Goal :</div>
          <div>
            {this.crowdfundingInfo.raiseGoal} {this.crowdfundingInfo.buyTokenName}
          </div>
        </div>
        <div class="review-info-item">
          <div class="title">Tokens For dCrowdfunding :</div>
          <div>
            {this.crowdfundingInfo.buyPrice! * this.crowdfundingInfo.raiseGoal!}{' '}
            {this.crowdfundingInfo.sellTokenName}
          </div>
        </div>
        <div class="review-info-item">
          <div class="title">Swap :</div>
          <div>{this.crowdfundingInfo.swapPercent}%</div>
        </div>
        <div class="review-info-item">
          <div class="title">IBO Rate :</div>
          <div>
            1 {this.crowdfundingInfo.buyTokenName} = {this.crowdfundingInfo.buyPrice}{' '}
            {this.crowdfundingInfo.sellTokenName}
          </div>
        </div>
        <div class="review-info-item">
          <div class="title">Maximum Buy :</div>
          <div>
            {this.crowdfundingInfo.maxBuyAmount} {this.crowdfundingInfo.buyTokenName}
          </div>
        </div>
        <div class="review-info-item">
          <div class="title">Sell Tax :</div>
          <div>{this.crowdfundingInfo.sellTax} %</div>
        </div>
        <div class="review-info-item">
          <div class="title">Maximum Sell :</div>
          <div>{this.crowdfundingInfo.maxSell} % of the bought token amount</div>
        </div>
        <div class="review-info-item">
          <div class="title">dCrowdfunding Start Time :</div>
          <div>{dayjs(this.crowdfundingInfo.startTime).format('YYYY-MM-DD HH:mm')}</div>
        </div>
        <div class="review-info-item">
          <div class="title">dCrowdfunding End Time :</div>
          <div>{dayjs(this.crowdfundingInfo.endTime).format('YYYY-MM-DD HH:mm')}</div>
        </div>
        {!!this.crowdfundingInfo.youtube && (
          <div class="review-info-item">
            <div class="title">Youtube :</div>
            <a href={this.crowdfundingInfo.youtube} target="__blank" class="text-primary">
              {this.crowdfundingInfo.youtube}
            </a>
          </div>
        )}
        {!!this.crowdfundingInfo.detail && (
          <div class="review-info-item">
            <div class="title">dCrowdfunding detail :</div>

            <a href={this.crowdfundingInfo.detail} target="__blank" class="text-primary">
              {this.crowdfundingInfo.detail}
            </a>
          </div>
        )}
      </div>
    )
  }
})
