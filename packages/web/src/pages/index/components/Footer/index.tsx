import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import smallLogo from '@/assets/small-logo.png'
import { FOOTER_LINKS } from '@/constants'

export default defineComponent({
  name: 'Footer',
  setup() {
    return () => (
      <div class="border-t-white m-auto border-t-1px border-opacity-10 pb-28px w-311px sm:flex sm:pt-36px sm:pb-62px sm:w-1110px">
        {/* about us */}
        <RouterLink
          class="flex mt-30px text-white mb-16px items-center block sm:mt-0 sm:mr-126px sm:items-baseline"
          to="/"
        >
          <img src={smallLogo} class="w-26px" />
          <span class="ml-16px text-24px leading-24px sm:ml-10px sm:text-30px">About us</span>
        </RouterLink>
        <div class="sm:flex sm:flex-1 sm:gap-40">
          {FOOTER_LINKS.map(data => (
            <div key={data.title} class="mb-40px">
              <div class="text-white pt-12px pb-12px text-18px leading-18px block sm:pb-16px sm:text-20px">
                {data.title}
              </div>
              {data.links.map(item => (
                <a
                  class="text-white pt-12px pb-12px text-15px leading-15px block sm:pb-16px sm:text-16px hover:text-primary"
                  key={item.title}
                  href={item.url}
                  target="_blank"
                >
                  {item.title}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }
})
