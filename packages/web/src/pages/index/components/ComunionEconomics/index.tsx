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
      <div class="h-800px w-full overflow-hidden relative sm:h-944px sm:pb-60px after:bg-gradient-to-b after:from-pageBgColor after:to-primary after:h-full after:rounded-br-1/2 after:rounded-bl-1/2 after:h-533px after:bottom-0 after:-left-1/1 after:w-3/1 after:content-[] after:absolute after:sm:h-784px">
        <div class={`${styles.comunionEconomicsBox} sm:hidden`}></div>
        <div class={`${styles.comunionEconomicsBoxH5} sm:hidden`}></div>
        <div class="z-1 relative">
          {/* title */}
          <h2 class="font-bold mt-83px text-white text-center text-24px sm:mt-185px sm:text-48px">
            Comunion Economics
          </h2>
          {/* introduce */}
          <div class="m-auto mt-23px text-white text-12px text-opacity-80 leading-15px w-311px sm:mt-37px sm:text-18px sm:leading-30px sm:w-1110px">
            <p class="text-left text-justify">
              Comunion Economics focuses on studying how to connect and organize workforces into
              production units and promote entrepreneurship and innovation within a decentralized
              economy. It also studies subjects including digital identity, smart contracts,
              tokenisation and decentralised governance arisen from blockchain technology.
            </p>
          </div>
          <div class="flex mt-36px w-full items-center justify-center sm:mt-64px sm:items-end <sm:flex-col">
            <p class="text-white text-center text-18px leading-18px sm:text-24px">
              in collaboration with
            </p>
            <img src={UBI} class="ml-18px w-116px <sm:mt-12px <sm:w-70px" />
          </div>

          <div class="mt-45px grid gap-x-15px gap-y-30px grid-cols-[128px,128px] grid-rows-[174px,174px] justify-center sm:mt-64px sm:gap-x-28px sm:grid-cols-[256px,256px,256px,256px] sm:grid-rows-[348px]">
            <div class="border-primary bg-[#00183c] bg-opacity-40 border-1 rounded-7px pt-25px sm:pt-50px">
              <p class="text-center text-bold text-white text-10px leading-14px sm:text-20px sm:leading-28px">
                Digital Identity
              </p>
              <img class="m-auto mt-32px w-90px sm:mt-64px sm:w-180px" src={digitalIdentity} />
            </div>
            <div class="border-primary bg-[#7D6100] bg-opacity-20 border-1 rounded-7px pt-25px sm:pt-50px">
              <p class="text-center text-bold text-white text-10px leading-14px sm:text-20px sm:leading-28px">
                Smart Contracts
              </p>
              <img class="m-auto mt-32px w-64px sm:mt-64px sm:w-127px" src={smartContracts} />
            </div>
            <div class="border-primary bg-[#00433C] bg-opacity-40 border-1 rounded-7px pt-25px sm:pt-50px">
              <p class="text-center text-bold text-white text-10px leading-14px sm:text-20px sm:leading-28px">
                Tokenisation
              </p>
              <img class="m-auto mt-25px w-71px sm:mt-64px sm:w-142px" src={tokenisation} />
            </div>
            <div class="border-primary bg-[#54000C] bg-opacity-24 border-1 rounded-7px pt-25px sm:pt-50px">
              <p class="text-center text-bold text-white text-10px leading-14px sm:text-20px sm:leading-28px">
                Governance
              </p>
              <img class="m-auto mt-25px w-100px sm:mt-64px sm:w-200px" src={governance} />
            </div>
          </div>
        </div>
      </div>
    )
  }
})
