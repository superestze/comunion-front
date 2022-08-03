import { UCard } from '@comunion/components'
import { defineComponent, PropType } from 'vue'

const CrowdfundingDetail = defineComponent({
  name: 'CrowdfundingDetail',
  props: {
    info: {
      type: Object as PropType<{
        detail: string
      }>
    }
  },
  setup(props) {
    return () => (
      <div class="flex mb-20 gap-6">
        <div class="w-228">
          <div class="p-10 bg-white border-1 border-grey5 mb-6 rounded-lg">1</div>
          <UCard title="info">
            <div class="mb-6">
              <iframe
                width="100%"
                height="320"
                src="https://www.youtube.com/embed/WeoBKYVNuQk"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
            <div class="mb-6">
              <div class="u-title2">Crowdfunding detail：</div>
              <a class="u-body2">{props.info?.detail}</a>
            </div>
            <div class="grid grid-cols-[220px,1fr] gap-y-6">
              <div class="u-body2 text-grey3">Crowdfunding Address :</div>
              <div>1</div>
              <div class="u-body2 text-grey3">Team Wallet Address :</div>
              <div></div>
              <div class="u-body2 text-grey3">Token Contract :</div>
              <div></div>
              <div class="u-body2 text-grey3">Token Name :</div>
              <div></div>
              <div class="u-body2 text-grey3">Token Symbol :</div>
              <div></div>
              <div class="u-body2 text-grey3">Token Decimals :</div>
              <div></div>
              <div class="u-body2 text-grey3">Total Supply :</div>
              <div></div>
              <div class="u-body2 text-grey3">Token For Crowdfunding :</div>
              <div></div>
              <div class="u-body2 text-grey3">IBO Rate :</div>
              <div></div>
              <div class="u-body2 text-grey3">Swap :</div>
              <div></div>
              <div class="u-body2 text-grey3">Sell Rate :</div>
              <div></div>
              <div class="u-body2 text-grey3">Maximum Sell :</div>
              <div></div>
              <div class="u-body2 text-grey3">Crowdfunding Start Time :</div>
              <div></div>
              <div class="u-body2 text-grey3">Crowdfunding End Time :</div>
              <div></div>
            </div>
          </UCard>
        </div>
        <div class="flex-1">
          <div class="p-10"></div>
          <UCard title="IBO  Rate History"></UCard>
          <UCard title="Investment Record"></UCard>
        </div>
      </div>
    )
  }
})

export default CrowdfundingDetail
