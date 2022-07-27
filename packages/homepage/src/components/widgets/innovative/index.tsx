import { defineComponent } from 'vue'
import Title from '../title'

import animate from './animate.module.css'
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
        <Title title="Innovative" class="mt-240px" />
        <div class="grid gap-x-30px gap-y-24px justify-center mt-78px">
          {this.list.map((item, $index) => {
            const str0 = $index === 0 && `row-start-1 row-end-2 col-start-1 col-end-2`
            const str1 = $index === 1 && `row-start-1 row-end-2 col-start-2 col-end-3`
            const srcset = handleSrcset(item.icons)
            return (
              <div
                class={`grid gap-x-30px gap-y-33px w-540px h-300px bg-white rounded-2px ${str0} ${str1} ${animate['undefined-float-shadow']}`}
                key={item.title}
              >
                <h1 class="flex items-center text-24px text-[#111] font-bold row-start-1 row-end-2 col-start-1 col-end-2 ml-32px">
                  {item.title}
                </h1>
                <p class="text-16px text-[#555] font-bold row-start-2 row-end-3 col-start-1 col-end-2 ml-32px leading-normal">
                  {item.content}
                </p>
                <div class="row-start-2 row-end-3 col-start-2 col-end-3 w-64px h-64px justify-start items-start mr-40px">
                  <img srcset={srcset} src={item.icons[0]} alt={item.title} />
                </div>
              </div>
            )
          })}
        </div>
        <div class="flex justify-center my-118px">
          <img srcset={`${mission}, ${mission2} 2x, ${mission3} 3x`} src={mission} />
        </div>
      </>
    )
  }
})
