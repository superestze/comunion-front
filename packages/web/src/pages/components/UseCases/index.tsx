import Blockchain from '@/assets/Blockchain.png'
import DAO from '@/assets/DAO.png'
import Exchange from '@/assets/Exchange.png'
import Metaverse from '@/assets/Metaverse.png'
import StartUp from '@/assets/Start-up.png'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UseCases',
  setup() {
    return () => (
      <div class="w-full overflow-hidden pb-78px sm:pb-150px">
        <div class="relative z-1 w-311px sm:w-1110px m-auto">
          {/* title */}
          <h2 class="font-bold text-white text-center sm:text-left mt-35px sm:mt-110px text-24px sm:text-48px">
            Use cases
          </h2>
          {/* introduce */}
          <div class="mt-14px sm:mt-17px text-12px sm:text-18px text-white text-opacity-80 leading-15px sm:leading-24px w-311px sm:w-940px <sm:m-auto">
            <p class="text-left text-justify">
              Comunion aims to construct a new startup paradigm for the digital age, support
              individuals to kick start their business, incubate these organizations from 0 to 1 and
              help these organizations to grow into unicorns
            </p>
          </div>
          <div class="flex flex-wrap items-center mt-68px sm:mt-95px sm:justify-between px-30px sm:px-20px">
            <div class="flex flex-col items-center group">
              <img
                src={StartUp}
                class="w-55px sm:110px transform transition group-hover:-translate-y-10px"
              />
              <span class="text-10px sm:text-20px mt-18px sm:mt-36px text-white">Start-up</span>
            </div>
            <div class="flex flex-col items-center <sm:ml-36px group">
              <img
                src={Blockchain}
                class="w-55px sm:110px transform transition group-hover:-translate-y-10px"
              />
              <span class="text-10px sm:text-20px mt-18px sm:mt-36px text-white">Blockchain</span>
            </div>
            <div class="flex flex-col items-center <sm:ml-36px group">
              <img
                src={Metaverse}
                class="w-55px sm:110px transform transition group-hover:-translate-y-10px"
              />
              <span class="text-10px sm:text-20px mt-18px sm:mt-36px text-white">Metaverse</span>
            </div>
            <div class="flex flex-col items-center <sm:mt-40px <sm:ml-38px group">
              <img
                src={Exchange}
                class="w-55px sm:110px transform transition group-hover:-translate-y-10px"
              />
              <span class="text-10px sm:text-20px mt-18px sm:mt-36px text-white">Exchange</span>
            </div>
            <div class="flex flex-col items-center <sm:mt-40px <sm:ml-66px group">
              <img
                src={DAO}
                class="w-55px sm:110px transform transition group-hover:-translate-y-10px"
              />
              <span class="text-10px sm:text-20px mt-18px sm:mt-36px text-white">DAO</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
})
