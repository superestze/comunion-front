import { defineComponent, reactive } from 'vue'
import styles from './index.module.css'
import rightArrowWhite from '@/assets/right-arrow-white.png'

export default defineComponent({
  name: 'Mission',
  setup() {
    const data = reactive({ current: 0 })
    const infoList = [
      {
        id: 1,
        shortTitle: 'Elevate labor income',
        title: 'Improve income by sharing upside',
        content:
          'Currently workers get paid fixed salary in fiat currency. Quantitative Easing has significantly inflated living expenses and asset price, labor income has been declining on both relative and absolute terms. In Comunion, participants get paid in tokens representing stakes in the startup, sharing capital upside of the business.'
      },
      {
        id: 2,
        shortTitle: 'Break capital monopoly',
        title: 'Talent is the main driver for innovation, not capital',
        content:
          'At present, there is high barrier for individuals to start their own businesses as they are unable to obtain the kickstarting capital and thus unable to recruit employees. However, in Comunion, comers exchange visions with others and form a consensus centered team. In addition, Comunion provides fund raising and governance solutions to support the growth.'
      },
      {
        id: 3,
        shortTitle: 'Eliminate entrepreneurship barrier',
        title: 'Organizations formed by consensus',
        content:
          'In Comunion, anyone can create a startup without upfront cost to hire employees and rent an office. Team is fluid and formed around a shared vision, you can simply work in a virtual workplace with a computer now and VRs in the future.'
      },
      {
        id: 4,
        shortTitle: 'Reduce wealth gap',
        title: 'Workers largely excluded from capital gain',
        content:
          'Most of us are unable to meet the minimum investment amount and excluded from the current PE/VC framework. With Comunion, individuals could invest a small amount of capital with a promosing startup or simply work for the startup to earn stakes in the business.'
      }
    ]

    return () => (
      <div class="h-813px w-full overflow-hidden relative sm:h-854px after:bg-gradient-to-b after:from-home-bg after:to-primary after:h-full after:rounded-br-1/2 after:rounded-bl-1/2 after:bottom-0 after:-left-1/1 after:w-3/1 after:content-[] after:absolute after:sm:h-761px ">
        <div class={`${styles.missionBox} <sm:hidden`}></div>
        <div class={`${styles.missionBoxH5} sm:hidden`}></div>
        <div class="m-auto w-311px z-1 relative sm:w-1110px">
          {/* title */}
          <h2 class="font-bold mt-96px text-white text-center text-24px sm:mt-188px sm:text-48px">
            Mission
          </h2>
          {/* introduce */}
          <div class="mt-12px text-white text-12px text-opacity-80 leading-15px sm:mt-15px sm:text-18px">
            <p class="text-left text-justify sm:m-auto sm:text-center sm:w-852px">
              Internet, AI and automation have fueled GDP growth, new social problems which can not
              be dealt with conventional ways have emerged.
            </p>
          </div>
          {/* devoted to */}
          <p class="mt-36px text-white text-left text-14px leading-20px sm:m-auto sm:mt-50px sm:text-center sm:text-20px">
            Comunion is devoted to :
          </p>
          <div class="flex m-auto mt-100px justify-between sm:w-1110px <sm:hidden">
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
                    <p class="text-white text-32px leading-40px">{item.title}</p>
                    <p class="mt-33px text-white text-justify text-15px leading-26px">
                      {item.content}
                    </p>
                  </div>
                )
            )}
          </div>
          <div class="pt-60px sm:hidden">
            {infoList.map((item, index) => (
              <div key={index}>
                <button
                  class={`flex rounded-22px h-44px mb-10px items-center justify-center focus:outline-none focus:border-0px ${
                    data.current === index && 'bg-primary px-24px'
                  }`}
                  onClick={() => {
                    data.current = index
                  }}
                >
                  <span class="text-white text-bold text-13px">{item.shortTitle}</span>
                  <img
                    class={`h-12px ml-10px w-14px transition-all transform opacity-0 ${
                      data.current === index ? 'ml-10px opacity-100' : '-ml-16px'
                    }`}
                    src={rightArrowWhite}
                  />
                </button>
                {data.current === index && (
                  <p class="mt-20px text-white text-20px leading-26px">{item.title}</p>
                )}
                {data.current === index && (
                  <p class="mt-10px text-white text-justify mb-30px text-12px leading-18px">
                    {item.content}
                  </p>
                )}
              </div>
            ))}
            {/* <p class="mt-46px text-white text-bold text-13px leading-13px">
              Break capital monopoly
            </p>
            <p class="mt-38px text-white text-bold text-13px leading-13px">
              Eliminate startup barrier
            </p>
            <p class="mt-38px text-white text-bold text-13px leading-13px">Reduce wealth gap</p> */}
          </div>
        </div>
      </div>
    )
  }
})
