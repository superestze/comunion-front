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
        <div>12</div>
        <div class="title">Token Contract :</div>
        <div></div>
        <div class="title">Team Wallet Address :</div>
        <div></div>
        <div class="title">Raise Goal :</div>
        <div></div>
        <div class="title">Tokens For Crowdfunding :</div>
        <div></div>
        <div class="title">Swap :</div>
        <div></div>
        <div class="title">IBO Rate :</div>
        <div></div>
        <div class="title">Maximum Buy :</div>
        <div></div>
        <div class="title">Sell Rate :</div>
        <div></div>
        <div class="title">Maximum Sell :</div>
        <div></div>
        <div class="title">Crowdfunding Start Time :</div>
        <div></div>
        <div class="title">Crowdfunding End Time :</div>
        <div></div>
        <div class="title">Youtube :</div>
        <div></div>
        <div class="title">Crowdfunding detail :</div>
        <div></div>
      </div>
    )
  }
})
