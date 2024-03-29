import { defineComponent } from 'vue'
import Blocks from '../blocks'
import Title from '../title'

import people from '@/assets/20220725/peoplecircle.png'
import people1 from '@/assets/20220725/peoplecircle1.png'
import people1_2 from '@/assets/20220725/peoplecircle1@2x.png'
import people1_3 from '@/assets/20220725/peoplecircle1@3x.png'
import people2 from '@/assets/20220725/peoplecircle2.png'
import people2_2 from '@/assets/20220725/peoplecircle2@2x.png'
import people2_3 from '@/assets/20220725/peoplecircle2@3x.png'
import people_2 from '@/assets/20220725/peoplecircle@2x.png'
import people_3 from '@/assets/20220725/peoplecircle@3x.png'
import relation from '@/assets/20220725/relation.png'
import relation2 from '@/assets/20220725/relation@2x.png'
import relation3 from '@/assets/20220725/relation@3x.png'
import { handleSrcset } from '@/utils/srcset'

export default defineComponent({
  render() {
    const list = [
      {
        icons: [people, people_2, people_3],
        title: 'Founders',
        subtitle: '',
        content:
          'Anyone with an idea or proposition can launch their own startup with a click of a button and expand their horizons around the world.'
      },
      {
        icons: [people1, people1_2, people1_3],
        title: 'Remoters',
        subtitle: '',
        content:
          'Anyone, no matter what country they are from, can find opportunities to work remotely and be rewarded for their work and skills.'
      },
      {
        icons: [people2, people2_2, people2_3],
        title: 'Investors',
        subtitle: '',
        content:
          'Anyone can become an investor and make capital gains by investing in a prospective startup they approve of.'
      }
    ]
    const srcset = handleSrcset([relation, relation2, relation3])
    return (
      <>
        <Title title="A New Relation of Production " subTitle="shift your role liberally" />
        <div class="flex justify-center mt-136px  <md:mx-auto <md:w-155.5 <md:max-h-[35vh]">
          <img src={relation} alt="relation" srcset={srcset} />
        </div>
        <Blocks list={list} class="mt-155px" />
      </>
    )
  }
})
