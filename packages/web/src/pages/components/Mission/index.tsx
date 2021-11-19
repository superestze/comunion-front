import rightArrowWhite from '@/assets/right-arrow-white.png'
import { defineComponent, reactive } from 'vue'
import styles from './index.module.css'

export default defineComponent({
  name: 'Mission',
  setup() {
    const data = reactive({ current: 0 })
    const infoList = [
      {
        id: 1,
        shortTitle: 'Elevate labor income',
        title: 'Income comprises labor and capital income, on both relative and absolute terms',
        content:
          'Currently workers get paid fixed salary in fiat currency. Quantitative Easing has significantly inflated living expenses and asset price, labor income has been declining on both relative and absolute terms. In Comunion, participants gets paid by tokens representing stakes in the startup, sharing capital upside of the business.'
      },
      {
        id: 2,
        shortTitle: 'Break capital monopoly',
        title: 'Talent is the main driver of economic development and innovation, not capital',
        content:
          'At present, there is high barrier for individuals to start their own businesses as they are unable to obtain the kickstarting capital and thus unable to recruit employees. However, in Comunion, comers exchange visions with others and form a consensus centered team. In addition, Comunion provides fund raising and governance solutions to support the growth.'
      },
      {
        id: 3,
        shortTitle: 'Eliminate entrepreneurship barrier',
        title:
          'In digital economy, production tools are now simply smart phones, computers and individual’s creativity and innovation',
        content:
          'In Comunion, anyone can initiate a startup with minimum upfront cost such as hiring employees or renting workplaces. Team is formed around a shared vision and participants receive tokens representing stakes in the businesses. '
      },
      {
        id: 4,
        shortTitle: 'Reduce wealth gap',
        title: 'Workers have been largely excluded from capital gain',
        content:
          'Most of us are unable to meet the minimum investment amount and excluded from the current PE/VC framework, missing the opportunities to invest with promising startups or private companies. On Comunion, individuals could put in any amount of capital or simply work for it to take up early stakes in an organization, enjoying outsized returns which are exclusive to the high networth individuals at the moment.'
      }
    ]

    return () => (
      <div class="h-813px sm:h-854px w-full overflow-hidden relative after:content after:absolute after:h-full after:sm:h-761px after:w-3/1 after:-left-1/1 after:bottom-0 after:h-full after:bg-gradient-to-b after:from-pageBgColor after:to-primary after:rounded-br-1/2 after:rounded-bl-1/2">
        <div class={`${styles.missionBox} <sm:hidden`}></div>
        <div class={`${styles.missionBoxH5} sm:hidden`}></div>
        <div class="relative z-1 w-311px sm:w-1110px m-auto">
          {/* title */}
          <h2 class="font-bold text-white text-center mt-96px sm:mt-188px text-24px sm:text-48px">
            Mission
          </h2>
          {/* introduce */}
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
            <div class="text-30px w-400px">
              {infoList.map((item, index) => (
                <button
                  key={item.id}
                  class={`h-38px flex items-center justify-center rounded-22px px-30px whitespace-nowrap border-1px mb-18px border-white border-opacity-0 hover:border-opacity-100 hover:border-1px hover:border-white focus:outline-none focus:border-0px ${
                    data.current === index && 'bg-primary '
                  }`}
                  onClick={() => {
                    data.current = index
                  }}
                >
                  <span class="text-white text-bold text-16px">{item.shortTitle}</span>
                  <img
                    class={`w-17px ml-12px transition-all transform opacity-0 ${
                      data.current === index ? 'ml-12px opacity-100' : '-ml-18px'
                    }`}
                    src={rightArrowWhite}
                  />
                </button>
              ))}
            </div>
            {infoList.map(
              (item, index) =>
                data.current === index && (
                  <div key={index} class="flex-1">
                    <p class="text-32px leading-40px text-white">{item.title}</p>
                    <p class="text-15px leading-26px text-white mt-33px text-justify">
                      {item.content}
                    </p>
                  </div>
                )
            )}
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
