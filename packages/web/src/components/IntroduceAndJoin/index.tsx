import { defineComponent } from 'vue'
import joinComunion from '../../assets/join-comunion.png'
import rightArrowIcon from '../../assets/right-arrow-small.png'

export default defineComponent({
  name: 'IntroduceAndJoin',
  setup() {
    return () => (
      <div class="h-580px pt-66px sm:h-844px sm:pt-60px w-full overflow-hidden relative after:content after:absolute after:w-3/1 after:-left-1/1 after:top-0 after:h-full after:bg-primary after:rounded-br-1/2 after:rounded-bl-1/2">
        <div class="relative z-1">
          {/* 标题 */}
          <h1 class="font-bold text-white text-center mt-83px text-24px sm:mt-161px sm:text-68px sm:leading-80px">
            Incubate ZERO To ONE
          </h1>
          {/* 介绍 */}
          <div class="text-center mt-24px text-13px text-white text-opacity-80 leading-15px sm:mt-36px sm:leading-30px sm:text-22px">
            <p class="text-bold">Comunion is a metatech</p>
            <p class="mt-19px w-330px sm:w-780px m-auto">
              We reorganize labor, resources and capital in a decentralized way within the shared
              online space, and empower super individuals to change the world
            </p>
          </div>
          {/* 加入Comunion*/}
          <a
            class="w-205px h-48px sm:w-254px sm:h-54px bg-white m-auto flex items-center pl-56px sm:pl-63px mt-58px sm:mt-70px rounded-24px sm:rounded-27px group"
            href="https://dev.comunion.io/"
            target="_blank"
          >
            <span class="text-primary text-bold text-13px sm:text-18px">Join Comunion</span>
            <img
              class="w-16px sm:w-17px ml-11px group-hover:ml-22px transition-all"
              src={joinComunion}
            />
          </a>
          {/* I want to… */}
          <div class="w-560px mt-95px text-white m-auto <sm:hidden">
            <p class="text-20px leading-28px">I want to…</p>
            <div class="flex items-center justify-between leading-17px text-12px mt-30px">
              <a
                class="flex items-center cursor-pointer group"
                href="https://dev.comunion.io/"
                target="_blank"
              >
                <span class="opacity-81 transform transition group-hover:-translate-y-10px">
                  Build a startup
                </span>
                <img
                  src={rightArrowIcon}
                  class="w-12px ml-4px transform transition group-hover:-translate-y-10px"
                />
              </a>
              <a
                class="flex items-center cursor-pointer group"
                href="https://dev.comunion.io/"
                target="_blank"
              >
                <span class="opacity-81 transform transition group-hover:-translate-y-10px">
                  Seek remote work
                </span>
                <img
                  src={rightArrowIcon}
                  class="w-12px ml-4px transform transition group-hover:-translate-y-10px"
                />
              </a>
              <a
                class="flex items-center cursor-pointer group"
                href="https://dev.comunion.io/"
                target="_blank"
              >
                <span class="opacity-81 transform transition group-hover:-translate-y-10px">
                  Invest
                </span>
                <img
                  src={rightArrowIcon}
                  class="w-12px ml-4px transform transition group-hover:-translate-y-10px"
                />
              </a>
              <a
                class="flex items-center cursor-pointer group"
                href="https://dev.comunion.io/"
                target="_blank"
              >
                <span class="opacity-81 transform transition group-hover:-translate-y-10px">
                  Setup a DAO
                </span>
                <img
                  src={rightArrowIcon}
                  class="w-12px ml-4px transform transition group-hover:-translate-y-10px"
                />
              </a>
            </div>
          </div>
          <div class="w-311px mt-60px text-white m-auto sm:hidden">
            <p class="text-14px leading-20px">I want to…</p>
            <div class="flex items-center leading-12px text-12px mt-20px">
              <a class="flex items-center w-166px" href="https://dev.comunion.io/" target="_blank">
                <span class="opacity-81">Build a startup</span>
                <img src={rightArrowIcon} class="w-12px ml-4px" />
              </a>
              <a class="flex items-center" href="https://dev.comunion.io/" target="_blank">
                <span class="opacity-81">Seek remote work</span>
                <img src={rightArrowIcon} class="w-12px ml-4px" />
              </a>
            </div>
            <div class="flex items-center leading-12px text-12px mt-20px">
              <a class="flex items-center w-166px" href="https://dev.comunion.io/" target="_blank">
                <span class="opacity-81">Invest</span>
                <img src={rightArrowIcon} class="w-12px ml-4px" />
              </a>
              <a class="flex items-center" href="https://dev.comunion.io/" target="_blank">
                <span class="opacity-81">Setup a DAO</span>
                <img src={rightArrowIcon} class="w-12px ml-4px" />
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
})
