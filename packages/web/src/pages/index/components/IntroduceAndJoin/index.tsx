import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import styles from './index.module.css'
import joinComunion from '@/assets/join-comunion.png'
import rightArrowIcon from '@/assets/right-arrow-small.png'
import { useUserStore } from '@/stores'

export default defineComponent({
  name: 'IntroduceAndJoin',
  setup() {
    const userStore = useUserStore()
    const router = useRouter()
    const toJoin = () => {
      if (!userStore.logged) {
        router.push('/auth/login')
      } else {
        router.push('/welcome')
      }
    }
    return () => (
      <div class="h-646px w-full pt-66px overflow-hidden relative sm:h-250 sm:pt-60px after:bg-primary after:h-full after:rounded-br-1/2 after:rounded-bl-1/2 after:top-0 after:-left-1/1 after:w-3/1 after:z-1 after:content-[] after:absolute ">
        <div class={`${styles.introduceAndJoinBox} <sm:hidden`}></div>
        <div class={`${styles.introduceAndJoinBoxH5} sm:hidden`}></div>
        <div class="z-3 relative">
          {/* title */}
          <h1 class="font-bold mt-83px text-white text-center text-24px sm:mt-161px sm:text-68px sm:leading-80px">
            Incubate ZERO To ONE
          </h1>
          {/* introduce */}
          <div class="mt-24px text-center text-white text-13px text-opacity-80 leading-15px sm:mt-36px sm:text-22px sm:leading-30px">
            <p class="text-bold">Comunion is Metaverse</p>
            <p class="m-auto mt-19px w-330px sm:w-780px">
              A New generation start-up paradigm crypto economy growth on multi-chain network. It
              uses modern internet ability to attract intensive talents around the Global and the
              application of Blockchain technology to improve finance and capital. Productivity
              tools are gathered to build innovative start-ups under the paradigm of Comunion (DAO)
              ; this form ultimately maximizes economic development through start-ups.
            </p>
          </div>
          {/* Join Comunion*/}
          <div
            class="bg-white cursor-pointer flex m-auto rounded-24px h-48px mt-58px pl-56px w-205px items-center group sm:rounded-27px sm:h-54px sm:mt-70px sm:pl-63px sm:w-254px"
            onClick={toJoin}
          >
            <span class="text-primary text-bold text-13px sm:text-18px">Join Comunion</span>
            <img
              class="ml-11px transition-all w-16px sm:w-17px group-hover:ml-22px"
              src={joinComunion}
            />
          </div>
          {/* I want to… */}
          {/* https://dev.comunion.io/ */}
          <div class="m-auto mt-95px text-white w-560px <sm:hidden">
            <p class="text-20px leading-28px">I want to…</p>
            <div class="flex mt-30px text-12px leading-17px items-center justify-between">
              <a class="cursor-pointer flex items-center group">
                <span
                  class={`opacity-81 transform transition group-hover:-translate-y-2px ${styles.wantToText}`}
                >
                  Build a Startup
                </span>
                <img
                  src={rightArrowIcon}
                  class="ml-4px transform transition w-12px group-hover:-translate-y-2px"
                />
              </a>
              <a class="cursor-pointer flex items-center group">
                <span
                  class={`opacity-81 transform transition group-hover:-translate-y-2px ${styles.wantToText}`}
                >
                  Seek remote work
                </span>
                <img
                  src={rightArrowIcon}
                  class="ml-4px transform transition w-12px group-hover:-translate-y-2px"
                />
              </a>
              <a class="cursor-pointer flex items-center group">
                <span
                  class={`opacity-81 transform transition group-hover:-translate-y-2px ${styles.wantToText}`}
                >
                  Invest
                </span>
                <img
                  src={rightArrowIcon}
                  class="ml-4px transform transition w-12px group-hover:-translate-y-2px"
                />
              </a>
              <a class="cursor-pointer flex items-center group">
                <span
                  class={`opacity-81 transform transition group-hover:-translate-y-2px ${styles.wantToText}`}
                >
                  Setup a DAO
                </span>
                <img
                  src={rightArrowIcon}
                  class="ml-4px transform transition w-12px group-hover:-translate-y-2px"
                />
              </a>
            </div>
          </div>
          <div class="m-auto mt-60px text-white w-311px sm:hidden">
            <p class="text-14px leading-20px">I want to…</p>
            <div class="flex mt-20px text-12px leading-12px items-center">
              <a class="flex w-166px items-center">
                <span class={`opacity-81 ${styles.h5WantToText}`}>Build a Startup</span>
                <img src={rightArrowIcon} class="ml-4px w-12px" />
              </a>
              <a class="flex items-center">
                <span class={`opacity-81 ${styles.h5WantToText}`}>Seek remote work</span>
                <img src={rightArrowIcon} class="ml-4px w-12px" />
              </a>
            </div>
            <div class="flex mt-20px text-12px leading-12px items-center">
              <a class="flex w-166px items-center">
                <span class={`opacity-81 ${styles.h5WantToText}`}>Invest</span>
                <img src={rightArrowIcon} class="ml-4px w-12px" />
              </a>
              <a class="flex items-center">
                <span class={`opacity-81 ${styles.h5WantToText}`}>Setup a DAO</span>
                <img src={rightArrowIcon} class="ml-4px w-12px" />
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
})
