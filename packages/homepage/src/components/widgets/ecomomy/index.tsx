import { defineComponent } from 'vue'

import Blocks from '../blocks'
import Title from '../title'

import contributor from '@/assets/20220725/contributor.png'
import contributor2 from '@/assets/20220725/contributor@2x.png'
import contributor3 from '@/assets/20220725/contributor@3x.png'

import crowdfunding from '@/assets/20220725/crowdfunding.png'
import crowdfunding2 from '@/assets/20220725/crowdfunding@2x.png'
import EcomomyBg from '@/assets/20220725/new_ecomomy.png'
import EcomomyBg2 from '@/assets/20220725/new_ecomomy@2x.png'
import EcomomyBg3 from '@/assets/20220725/new_ecomomy@3x.png'
import startup from '@/assets/20220725/startup.png'
import startup2 from '@/assets/20220725/startup@2x.png'
import { handleSrcset } from '@/utils/srcset'

export default defineComponent({
  render() {
    const list = [
      {
        icons: [contributor, contributor2, contributor3],
        title: 'Buidler',
        subtitle: 'Build to earn',
        content:
          'Anyone with skills can build or contribute to a startup in the 0-1 stage for earning early rewards.'
      },
      {
        icons: [startup, startup2],
        title: 'Startup',
        subtitle: 'Startup as an economy',
        content:
          'Startup, as the core production unit of economy, can be refactored to drive a new economy growth.'
      },
      {
        icons: [crowdfunding, crowdfunding2],
        title: 'Crowdfunding',
        subtitle: 'Invest to build',
        content:
          'Anyone holding capital can be an angel investor in building the next big thing without minimum investment threshold.'
      }
    ]
    const srcset = handleSrcset([EcomomyBg, EcomomyBg2, EcomomyBg3])
    return (
      <>
        <Title
          title="All-in-one co-building network"
          subTitle="Connect ideas, talents and funding for Startups"
        />
        <div class="flex justify-center mt-74px <md:mx-auto <md:w-155.5 <md:max-h-[40vh]">
          <img class="object-fill h-auto" src={EcomomyBg} alt="new ecomomy" srcset={srcset} />
        </div>
        <Blocks list={list} class="mt-155px" />
      </>
    )
  }
})
