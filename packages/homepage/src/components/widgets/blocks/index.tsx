import { defineComponent, PropType } from 'vue'

import animate from './animate.module.css'
import styles from './index.module.css'
import { handleSrcset } from '@/utils/srcset'

export type Item = {
  icons: string[]
  title: string
  subtitle: string
  content: string
}

export default defineComponent({
  props: {
    list: {
      type: Array as PropType<Item[]>,
      required: true,
      default: () => []
    }
  },
  render() {
    return (
      <div class="flex justify-center <md:flex-col">
        {this.list.map(item => {
          const srcset = handleSrcset(item.icons)
          return (
            <div
              class={`flex <md:w-155.5 <md:h-95 <md:mx-auto w-370px h-395px flex-col items-center ${styles.hoverBox} ${animate['undefined-back-pulse']}`}
              key={item.title}
            >
              <div class="w-16 h-16 mt-14.5 mx-auto">
                <img src={item.icons[0]} srcset={srcset} alt={item.title} />
              </div>
              <h1 class="text-[1.5rem] font-bold text-center mt-10 text-center mb-6.25 text-[#111] <md:mt-9 <md:mb-3">
                {item.title}
              </h1>
              {item.subtitle && (
                <h3 class="text-[1.25rem] font-bold text-center text-center mb-0.75 text-[#555] <md:mb-3">
                  {item.subtitle}
                </h3>
              )}
              <p class="text-[1rem] text-center mb-18 mt-1 mx-8.5 text-[#555] leading-normal <md:w-80 <md:mx-auto">
                {item.content}
              </p>
            </div>
          )
        })}
      </div>
    )
  }
})
