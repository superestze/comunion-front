import { defineComponent } from 'vue'
import Title from '../title'

import innovative1 from '@/assets/20220725/innovative1.png'
import innovative1_2 from '@/assets/20220725/innovative1@2x.png'
import innovative1_3 from '@/assets/20220725/innovative1@3x.png'

import innovative2 from '@/assets/20220725/innovative2.png'
import innovative2_2 from '@/assets/20220725/innovative2@2x.png'
import innovative2_3 from '@/assets/20220725/innovative2@3x.png'

import innovative3 from '@/assets/20220725/innovative3.png'
import innovative3_2 from '@/assets/20220725/innovative3@2x.png'
import innovative3_3 from '@/assets/20220725/innovative3@3x.png'

import innovative4 from '@/assets/20220725/innovative4.png'
import innovative4_2 from '@/assets/20220725/innovative4@2x.png'
import innovative4_3 from '@/assets/20220725/innovative4@3x.png'
import mission from '@/assets/20220725/mission.png'
import mission2 from '@/assets/20220725/mission@2x.png'
import mission3 from '@/assets/20220725/mission@3x.png'
import { handleSrcset } from '@/utils/srcset'

export default defineComponent({
  setup() {
    const list = [
      {
        icons: [innovative1, innovative1_2, innovative1_3],
        title: 'One-Click Launch',
        content:
          'Integrated resources including talents, tasks, and fundings are provided for everyone to create their own startup with single one click of a button.'
      },
      {
        icons: [innovative2, innovative2_2, innovative2_3],
        title: 'Global Network',
        content:
          'Create a new generation of human incentives that provide more bounties, global talent and equity deposits, all of which are trusted by onchain.'
      },
      {
        icons: [innovative3, innovative3_2, innovative3_3],
        title: 'Initial Build Offerings',
        content:
          'Raise funds for a startup with greater efficiency and lower cost in a secure and guaranteed mechanism.'
      },
      {
        icons: [innovative4, innovative4_2, innovative4_3],
        title: 'DAO Governance',
        content:
          'Provide a suite of  DAO governance toolkits such as KYC, Audit, Decentralized Voting, Liquidity Locking, Treasury Management, etc.'
      }
    ]
    return {
      list
    }
  },
  render() {
    return (
      <>
        <Title title="Innovative" class="mt-60" />
        <div class="grid gap-x-30px gap-y-24px justify-center mt-78px <md:hidden">
          {this.list.map((item, $index) => {
            const str0 = $index === 0 && `row-start-1 row-end-2 col-start-1 col-end-2`
            const str1 = $index === 1 && `row-start-1 row-end-2 col-start-2 col-end-3`
            const srcset = handleSrcset(item.icons)
            return (
              <div
                class={`grid gap-x-30px gap-y-33px w-540px h-224px bg-[rgba(255,255,255,0.4)] rounded-2px ${str0} ${str1} hover:bg-white`}
                key={item.title}
              >
                <h1 class="flex items-end text-24px text-[#111] font-bold row-start-1 row-end-2 col-start-1 col-end-2 ml-32px">
                  {item.title}
                </h1>
                <p class="text-16px text-[#555] font-bold row-start-2 row-end-3 col-start-1 col-end-2 ml-32px leading-normal content-start">
                  {item.content}
                </p>
                <div class="row-start-2 row-end-3 col-start-2 col-end-3 w-64px h-64px justify-start items-start mr-40px">
                  <img srcset={srcset} src={item.icons[0]} alt={item.title} />
                </div>
              </div>
            )
          })}
        </div>
        <div class="flex flex-col justify-center mt-19.5 md:hidden relative z-1">
          {this.list.map((item, $index) => {
            const srcset = handleSrcset(item.icons)
            return (
              <div
                class="grid gap-x-7.5 gap-y-8.25 mx-auto h-86.5 w-155.5 bg-[rgba(255,255,255,0.4)] rounded-2px hover:bg-white mb-6"
                key={item.title}
              >
                <h1 class="flex items-end text-[2.25rem] text-[#111] font-bold row-start-1 row-end-2 col-start-1 col-end-2 ml-12">
                  {item.title}
                </h1>
                <p class="text-[1.5rem] text-[#555] font-400 row-start-2 row-end-3 col-start-1 col-end-2 ml-12 leading-normal content-start">
                  {item.content}
                </p>
                <div class="row-start-2 row-end-3 col-start-2 col-end-3 w-18 h-18 justify-start items-start mr-12">
                  <img srcset={srcset} src={item.icons[0]} alt={item.title} />
                </div>
              </div>
            )
          })}
        </div>
        {/* <md:h-67.5 */}
        <div class="flex justify-center my-118px <md:w-155.5 <md:mt-19.5 <md:mb-39.5 <md:mx-auto <md:max-h-[12vh]">
          <img srcset={`${mission}, ${mission2} 2x, ${mission3} 3x`} src={mission} />
        </div>
      </>
    )
  }
})
