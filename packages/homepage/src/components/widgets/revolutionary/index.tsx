import { defineComponent } from 'vue'
import Title from '../title'

import animate from './animate.module.css'
import styles from './index.module.css'

import p1 from '@/assets/20220725/p1.png'
import p1_2 from '@/assets/20220725/p1@2x.png'
import p1_3 from '@/assets/20220725/p1@3x.png'

import p3 from '@/assets/20220725/p3.png'
import p3_2 from '@/assets/20220725/p3@2x.png'
import p3_3 from '@/assets/20220725/p3@3x.png'

import p4 from '@/assets/20220725/p4.png'
import p4_2 from '@/assets/20220725/p4@2x.png'
import p4_3 from '@/assets/20220725/p4@3x.png'

import wallet from '@/assets/20220725/wallet.png'
import wallet_2 from '@/assets/20220725/wallet@2x.png'
import wallet_3 from '@/assets/20220725/wallet@3x.png'
import { handleSrcset } from '@/utils/srcset'

export default defineComponent({
  setup() {
    const list = [
      {
        icons: [p1, p1_2, p1_3],
        h1line1: 'Innovative',
        h1line2: 'Startup Protocol',
        content:
          'Easily create your startup at any time, in any place and without any permission or cost '
      },
      {
        icons: [wallet, wallet_2, wallet_3],
        h1line1: 'Capital Gain',
        h1line2: 'Earning',
        content:
          'Contribute to earn money and invest  in a secure and efficient way without barrier'
      },
      {
        icons: [p3, p3_2, p3_3],
        h1line1: 'More Opportunites',
        h1line2: 'Generated',
        content:
          'More opportunities available to anyone, including remote working, early stage investing, fundraising, etc.'
      },
      {
        icons: [p4, p4_2, p4_3],
        h1line1: 'Labor-Value',
        h1line2: 'Converter',
        content: 'Convert the value of labor into basic income and capital gains.'
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
          title="Revolutionary"
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
                <div class="w-62px h-62px mt-48px">
                  <img srcset={srcset} src={item.icons[0]} alt={item.h1line1} />
                </div>
                <h1 class="text-24px font-bold text-left mt-24px hover-text">{item.h1line1}</h1>
                <h1 class="text-24px font-bold text-left hover-text">{item.h1line2}</h1>
                <p class="text-16px font-bold text-[#555] text-left mt-30px mr-80px leading-normal">
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
