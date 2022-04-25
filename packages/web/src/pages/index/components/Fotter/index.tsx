import smallLogo from '@/assets/small-logo.png'
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
  name: 'Footer',
  setup() {
    const footerLinks = [
      {
        title: 'Connect with us',
        links: [
          {
            title: 'DOCS',
            url: 'https://docs.comunion.org'
          },
          {
            title: 'Twitter',
            url: 'https://twitter.com/Comunion01'
          },
          {
            title: 'Discord',
            url: 'https://discord.gg/9x4Up6aWRj'
          }
        ]
      },
      {
        title: 'Developers',
        links: [
          {
            title: 'Github',
            url: ' https://github.com/comunion-io/'
          }
        ]
      }
      // {
      //   title: 'Innovation',
      //   links: [
      //     {
      //       title: 'Private version',
      //       url: 'https://private.comunion.io/'
      //     },
      //     {
      //       title: 'Enterprise',
      //       url: '/'
      //     }
      //   ]
      // }
    ]

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
          {footerLinks.map(data => (
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
