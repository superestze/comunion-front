import { defineComponent } from 'vue'
import rightArrowWhite from '../../assets/right-arrow-white.png'

export default defineComponent({
  name: 'Mission',
  setup() {
    return () => (
      <div class="h-813px sm:h-854px w-full overflow-hidden relative after:content after:absolute after:h-full after:sm:h-761px after:w-3/1 after:-left-1/1 after:bottom-0 after:h-full after:bg-gradient-to-b after:from-pageBgColor after:to-primary after:rounded-br-1/2 after:rounded-bl-1/2">
        <div class="relative z-1 w-311px sm:w-1110px m-auto">
          {/* 标题 */}
          <h2 class="font-bold text-white text-center mt-96px sm:mt-188px text-24px sm:text-48px">
            Mission
          </h2>
          {/* 介绍 */}
          <div class="mt-12px sm:mt-15px text-12px sm:text-18px text-white text-opacity-80 leading-15px">
            <p class="text-left sm:text-center sm:w-852px text-justify sm:m-auto">
              AI, automation and platform model have become the growth engine of world economy. It
              has fueled GDP growth, however has created new social problems.
            </p>
          </div>
          {/* devoted to */}
          <p class="text-white leading-20px text-14px sm:text-20px mt-36px sm:mt-50px text-left sm:m-auto sm:text-center">
            Comunion is devoted to :
          </p>
          <div class="<sm:hidden sm:w-1110px m-auto flex justify-between mt-100px">
            <div class="text-30px">
              <button class="w-250px h-38px bg-primary flex items-center justify-center rounded-22px">
                <span class="text-white text-bold text-16px">JElevate labor income</span>
                <img class="w-17px ml-12px" src={rightArrowWhite} />
              </button>
              <p class="text-16px leading-16px text-white text-bold mt-30px ml-30px">
                Break capital monopoly
              </p>
              <p class="text-16px leading-16px text-white text-bold mt-30px ml-30px">
                Eliminate startup barrier
              </p>
              <p class="text-16px leading-16px text-white text-bold mt-30px ml-30px">
                Reduce wealth gap
              </p>
            </div>
            <div class="ml-125px">
              <p class="text-32px leading-40px text-white">
                Increase labor income on both relative and absolute terms
              </p>
              <p class="text-15px leading-26px text-white mt-33px text-justify">
                Currently workers get paid fixed salary in fiat currency. Quantitative Easing has
                significantly inflated living expenses and asset price, labor income has been
                declining on both relative and absolute terms. In Comunion, participants gets paid
                by tokens representing stakes in the startup, sharing capital upside of the
                business.
              </p>
            </div>
          </div>
          <div class="sm:hidden">
            <button class="w-206px h-44px bg-primary flex items-center justify-center mt-60px rounded-22px">
              <span class="text-white text-bold text-13px">JElevate labor income</span>
              <img class="w-14px h-12px ml-10px" src={rightArrowWhite} />
            </button>
            <p class="text-20px leading-26px text-white mt-30px">
              Increase labor income on both relative and absolute terms
            </p>
            <p class="text-12px leading-18px text-white mt-10px text-justify">
              Currently workers get paid fixed salary in fiat currency. Quantitative Easing has
              significantly inflated living expenses and asset price, labor income has been
              declining on both relative and absolute terms. In Comunion, participants gets paid by
              tokens representing stakes in the startup, sharing capital upside of the business.
            </p>
            <p class="text-13px leading-13px text-white text-bold mt-46px">
              Break capital monopoly
            </p>
            <p class="text-13px leading-13px text-white text-bold mt-38px">
              Eliminate startup barrier
            </p>
            <p class="text-13px leading-13px text-white text-bold mt-38px">Reduce wealth gap</p>
          </div>
        </div>
      </div>
    )
  }
})
