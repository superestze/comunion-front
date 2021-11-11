import { defineComponent } from 'vue'
import response1 from '../../assets/response-1.png'
import response2 from '../../assets/response-2.png'
import response3 from '../../assets/response-3.png'
import response4 from '../../assets/response-4.png'

export default defineComponent({
  name: 'OurResponse',
  setup() {
    return () => (
      <div class="h-685px sm:h-979px w-full overflow-hidden relative pb-35 pt-50px sm:pt-220px sm:pb-110px">
        <div class="relative z-1">
          {/* 标题 */}
          <h2 class="font-bold text-white text-center text-24px sm:text-48px">Our Response</h2>
          <p class="mt-20px sm:mt-40px text-primary text-15px sm:text-30px leading-18px sm:leading-36px text-center">
            Universal Value Universal Liquidity
          </p>
          {/* 介绍 */}
          <div class="mt-15px sm:mt-38px text-12px sm:text-18px text-white text-opacity-80 leading-15px sm:leading-30px w-311px sm:w-1110px m-auto">
            <p class="text-left text-justify sm:text-center">
              Comunion aims to construct a new startup paradigm for the digital age, support
              individuals to kick start their business, incubate these organizations from 0 to 1 and
              help these organizations to grow into unicorns
            </p>
          </div>
          <div class="grid mt-66px sm:mt-70px gap-x-15px sm:gap-x-28px gap-y-20px grid-cols-[128px,128px] sm:grid-cols-[256px,256px,256px,256px] grid-rows-[185px,185px] sm:grid-rows-[370px] justify-center">
            <div class="">
              <img class="w-full transform transition hover:-translate-y-10px" src={response1} />
            </div>
            <div class="">
              <img class="w-full transform transition hover:-translate-y-10px" src={response2} />
            </div>
            <div class="">
              <img class="w-full transform transition hover:-translate-y-10px" src={response3} />
            </div>
            <div class="">
              <img class="w-full transform transition hover:-translate-y-10px" src={response4} />
            </div>
          </div>
        </div>
      </div>
    )
  }
})
