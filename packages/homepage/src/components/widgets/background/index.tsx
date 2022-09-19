import { defineComponent } from 'vue'

import bgBubble1 from '@/assets/20220725/bg_bubble1.png'
import bgBubble1_2 from '@/assets/20220725/bg_bubble1@2x.png'
import bgBubble1_3 from '@/assets/20220725/bg_bubble1@3x.png'
import bgBubble2 from '@/assets/20220725/bg_bubble2.png'
import bgBubble2_2 from '@/assets/20220725/bg_bubble2@2x.png'
import bgBubble2_3 from '@/assets/20220725/bg_bubble2@3x.png'

import bgBubble3 from '@/assets/20220725/bg_bubble3.png'
import bgBubble4 from '@/assets/20220725/bg_bubble4.png'

import { handleSrcset } from '@/utils/srcset'

export default defineComponent({
  render() {
    const bubble1 = [bgBubble1, bgBubble1_2, bgBubble1_3]
    const bg1 = handleSrcset(bubble1)
    const bubble2 = [bgBubble2, bgBubble2_2, bgBubble2_3]
    const bg2 = handleSrcset(bubble2)
    return (
      <>
        <div class="absolute top-[92vh] left-0 right-0">
          <img class="w-full" srcset={bg1} src={bgBubble1} />
        </div>
        <div class="absolute bottom-1200px right-0 <md:bottom-696">
          <img class="w-full" srcset={bg2} src={bgBubble2} />
        </div>
        <div class="absolute left-0px top-1300px <md:top-403.5">
          <img class="w-full <md:h-22 <md:w-10" src={bgBubble3} />
        </div>
        <div class="absolute right-0px top-2100px <md:hidden">
          <img class="w-full" src={bgBubble4} />
        </div>
        <div class="absolute left-0px bottom-700px <md:bottom-696">
          <img class="w-full <md:h-32.5 <md:w-16.25" src={bgBubble3} />
        </div>
      </>
    )
  }
})
