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
    const random = Math.trunc(Math.random() * 4)
    console.log(random)
    const randomClass: string[] = [
      'undefined-bounce-to-right',
      'undefined-bounce-to-left',
      'undefined-bounce-to-top',
      'undefined-bounce-to-bottom'
    ]
    console.log(animate)
    return (
      <div class="flex justify-center">
        {this.list.map(item => {
          const srcset = handleSrcset(item.icons)
          return (
            <div
              class={`flex w-370px h395px flex-col items-center ${styles.hoverBox} ${
                animate[randomClass[Math.trunc(Math.random() * 4)]]
              }`}
              key={item.title}
            >
              <div class="w-64px h-64px mt-58px">
                <img src={item.icons[0]} srcset={srcset} alt={item.title} />
              </div>
              <h1
                class="text-24px font-bold text-center mt-40px text-center mb-25px"
                style={{ color: '#111111' }}
              >
                {item.title}
              </h1>
              {item.subtitle && (
                <h3
                  class="text-20px font-bold text-center text-center mb-3px"
                  style={{ color: '#555555' }}
                >
                  {item.subtitle}
                </h3>
              )}
              <p
                class="text-16px font-bold text-center mb-72px mt-3px mx-33px"
                style={{ color: '#555555' }}
              >
                {item.content}
              </p>
            </div>
          )
        })}
      </div>
    )
  }
})
