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
              <div class="w-64px h-64px mt-58px mx-auto">
                <img src={item.icons[0]} srcset={srcset} alt={item.title} />
              </div>
              <h1 class="text-24px font-bold text-center mt-40px text-center mb-25px text-[#111]">
                {item.title}
              </h1>
              {item.subtitle && (
                <h3 class="text-20px font-bold text-center text-center mb-3px text-[#555]">
                  {item.subtitle}
                </h3>
              )}
              <p class="text-16px text-center mb-72px mt-3px mx-33px text-[#555] leading-normal">
                {item.content}
              </p>
            </div>
          )
        })}
      </div>
    )
  }
})
