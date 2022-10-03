import { defineComponent } from 'vue'
import Title from '../title'

import animate from './animate.module.css'
import styles from './index.module.css'

// import p1 from '@/assets/20220725/p1.png'
// import p1_2 from '@/assets/20220725/p1@2x.png'
// import p1_3 from '@/assets/20220725/p1@3x.png'

// import p3 from '@/assets/20220725/p3.png'
// import p3_2 from '@/assets/20220725/p3@2x.png'
// import p3_3 from '@/assets/20220725/p3@3x.png'

// import p4 from '@/assets/20220725/p4.png'
// import p4_2 from '@/assets/20220725/p4@2x.png'
// import p4_3 from '@/assets/20220725/p4@3x.png'

// import wallet from '@/assets/20220725/wallet.png'
// import wallet_2 from '@/assets/20220725/wallet@2x.png'
// import wallet_3 from '@/assets/20220725/wallet@3x.png'

import comp1 from '@/assets/20220725/comp1.png'
import comp2 from '@/assets/20220725/comp2.png'
import comp3 from '@/assets/20220725/comp3.png'
import comp4 from '@/assets/20220725/comp4.png'

import { handleSrcset } from '@/utils/srcset'

export default defineComponent({
  setup() {
    const list = [
      {
        icons: [comp1, comp1, comp1],
        h1line1: 'A new era of economy',
        h1line2: 'Comunomics',
        content:
          'The core theory is based on technology of internet and blockchain to research how can increase income of labor through promoting labor’s liquidity and the capitalization of labor value'
      },
      {
        icons: [comp2, comp2, comp2],
        h1line1: 'A new decentralized organization ',
        h1line2: 'DCO',
        content:
          'Generate much higher efficient collaboration power through linking distributed labors and fragmented productivity to build. It born from DAO, but beyond DAO'
      },
      {
        icons: [comp3, comp3, comp3],
        h1line1: 'A new startup and innovation paradigm',
        h1line2: 'Comunion',
        content:
          'The new startup paradigm which is formed by bounty, dCrowdfunding, on-chain governance and other dApps that help everyone to launch and manage their startup without limiting          '
      },
      {
        icons: [comp4, comp4, comp4],
        h1line1: 'A new group of workers',
        h1line2: 'Comer',
        content:
          'They are gig workers, remoters, freelancers, builders or contributors etc who yearn for freedom living and working, especially want to change destiny'
      }
    ]
    return {
      list
    }
  },
  render() {
    return (
      <div class="flex flex-col items-center">
        <Title
          title="What is Comunion"
          subTitle="Generates an all-in-one meeting place for being dedicated to building a thriving and collaborative ecosystem, community, and economy"
        />
        <div class="flex flex-row flex-wrap w-1120px mx-auto mt-80px <md:hidden">
          {this.list.map((item, $index) => {
            const srcset = handleSrcset(item.icons)
            return (
              <div
                class={`${styles.hoverBox} ${animate['undefined-back-pulse']} flex flex-col flex-grow-0 flex-shrink-0 w-556px h-316px pl-48px ${animate['undefined-border-fade']} hover:text-primary`}
                key={item.h1line1}
              >
                <div class="w-12 h-12 mt-12">
                  <img srcset={srcset} src={item.icons[0]} alt={item.h1line1} />
                </div>
                <h1 class="text-20px text-[#555555] font-bold text-left mt-24px mb-4 hover-text">
                  {item.h1line1}
                </h1>
                <h1 class="text-24px font-bold text-left hover-text">{item.h1line2}</h1>
                <p class="text-16px font-bold text-[#555] text-left mt-4 mr-80px leading-normal">
                  {item.content}
                </p>
              </div>
            )
          })}
        </div>
        <div class="flex flex-col md:hidden mt-20">
          {this.list.map((item, $index) => {
            const srcset = handleSrcset(item.icons)
            return (
              <div
                class={`${styles.hoverBox} ${animate['undefined-back-pulse']} flex flex-col <md:w-155.5 <md:h-91 <md:mx-auto pl-14.5 pb-4 !h-auto ${animate['undefined-border-fade']} hover:text-primary mb-6`}
                key={item.h1line1}
              >
                <div class="w-12 h-12 mt-12">
                  <img srcset={srcset} src={item.icons[0]} alt={item.h1line1} />
                </div>
                <h1 class="font-bold text-[#555555] text-left mt-6 hover-text text-[2rem]">
                  {item.h1line1}
                </h1>
                <h1 class="font-bold text-left hover-text text-[2.5rem] mt-4">{item.h1line2}</h1>
                <p class="text-[1.5rem] font-400 text-[#555] text-left mt-4 mr-20 leading-normal">
                  {item.content}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
})
