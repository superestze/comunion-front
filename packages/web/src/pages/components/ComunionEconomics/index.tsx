import digitalIdentity from '@/assets/Digital Identity.png'
import governance from '@/assets/Governance.png'
import smartContracts from '@/assets/Smart Contracts.png'
import tokenisation from '@/assets/Tokenisation.png'
import UBI from '@/assets/UBI.png'
import { defineComponent } from 'vue'
import styles from './index.module.css'

export default defineComponent({
  name: 'ComunionEconomics',
  setup() {
    return () => (
      <div class="h-800px sm:h-944px w-full overflow-hidden relative after:content after:absolute after:h-533px after:sm:h-784px after:w-3/1 after:-left-1/1 after:bottom-0 after:h-full after:bg-gradient-to-b after:from-pageBgColor after:to-primary after:rounded-br-1/2 after:rounded-bl-1/2 sm:pb-60px">
        <div class={`${styles.comunionEconomicsBox} <sm:hidden`}></div>
        <div class={`${styles.comunionEconomicsBoxH5} sm:hidden`}></div>
        <div class="relative z-1">
          {/* title */}
          <h2 class="font-bold text-white text-center mt-83px sm:mt-185px text-24px sm:text-48px">
            Comunion Economics
          </h2>
          {/* introduce */}
          <div class="mt-23px sm:mt-37px text-12px sm:text-18px text-white text-opacity-80 leading-15px sm:leading-30px w-311px sm:w-1110px m-auto">
            <p class="text-left text-justify">
              Comunion Economics focuses on studying how to connect and organize workforces into
              production units and promote entrepreneurship and innovation within a decentralized
              economy. It also studies subjects including digital identity, smart contracts,
              tokenisation and decentralised governance arisen from blockchain technology.
            </p>
          </div>
          <div class="flex <sm:flex-col sm:items-end items-center justify-center mt-36px sm:mt-64px w-full">
            <p class="text-white leading-18px text-18px sm:text-24px text-center">
              in collaboration with
            </p>
            <img src={UBI} class="w-116px ml-18px <sm:mt-12px <sm:w-70px" />
          </div>

          <div class="grid mt-45px sm:mt-64px gap-x-15px sm:gap-x-28px gap-y-30px grid-cols-[128px,128px] sm:grid-cols-[256px,256px,256px,256px] grid-rows-[174px,174px] sm:grid-rows-[348px] justify-center">
            <div class="border-1 border-primary rounded-7px bg-[#00183c] bg-opacity-40 pt-25px sm:pt-50px">
              <p class="text-center text-bold text-10px sm:text-20px leading-14px sm:leading-28px text-white">
                Digital Identity
              </p>
              <img class="m-auto w-90px sm:w-180px mt-32px sm:mt-64px" src={digitalIdentity} />
            </div>
            <div class="border-1 border-primary rounded-7px bg-[#7D6100] bg-opacity-20 pt-25px sm:pt-50px">
              <p class="text-center text-bold text-10px sm:text-20px leading-14px sm:leading-28px text-white">
                Smart Contracts
              </p>
              <img class="m-auto w-64px mt-32px sm:mt-64px sm:w-127px" src={smartContracts} />
            </div>
            <div class="border-1 border-primary rounded-7px bg-[#00433C] bg-opacity-40 pt-25px sm:pt-50px">
              <p class="text-center text-bold text-10px sm:text-20px leading-14px sm:leading-28px text-white">
                Tokenisation
              </p>
              <img class="m-auto w-71px mt-25px sm:mt-64px sm:w-142px" src={tokenisation} />
            </div>
            <div class="border-1 border-primary rounded-7px bg-[#54000C] bg-opacity-24 pt-25px sm:pt-50px">
              <p class="text-center text-bold text-10px sm:text-20px leading-14px sm:leading-28px text-white">
                Governance
              </p>
              <img class="m-auto w-100px mt-25px sm:mt-64px sm:w-200px" src={governance} />
            </div>
          </div>
        </div>
      </div>
    )
  }
})
