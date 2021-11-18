import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import smallLogo from '../../assets/small-logo.png'

export default defineComponent({
  name: 'Fotter',
  setup() {
    const footerLinks = [
      {
        title: 'Connect with us',
        links: [
          {
            title: 'Wlkl',
            url: 'https://wiki.comunion.io/'
          },
          {
            title: 'BBS',
            url: 'https://bbs.comunion.io/'
          },
          {
            title: 'Yuque',
            url: 'https://comunion.yuque.com/'
          },
          {
            title: 'Story',
            url: '/'
          }
        ]
      },
      {
        title: 'Developers',
        links: [
          {
            title: 'Github',
            url: ' https://github.com/comunion-io/'
          },
          {
            title: 'Yapi',
            url: ' https://yapi.comunion.io/'
          },
          {
            title: 'Taiga',
            url: ' https://taiga.comunion.io/'
          }
        ]
      },
      {
        title: 'Innovation',
        links: [
          {
            title: 'Private version',
            url: 'https://private.comunion.io/'
          },
          {
            title: 'Enterprise',
            url: '/'
          }
        ]
      }
    ]

    return () => (
      <div class="w-311px sm:w-1110px m-auto border-t-1px border-t-white mt-40px border-opacity-10 pb-28px sm:pb-62px sm:pt-36px sm:flex">
        {/* about us */}
        <RouterLink
          class="flex items-center sm:items-baseline text-white mt-30px sm:mt-0 mb-16px block sm:mr-126px"
          to="/"
        >
          <img src={smallLogo} class="w-26px" />
          <span class="ml-16px sm:ml-10px leading-24px text-24px sm:text-30px">About us</span>
        </RouterLink>
        <div class="sm:flex sm:justify-between sm:flex-1">
          {footerLinks.map(data => (
            <div key={data.title} class="mb-40px">
              <div class="pt-12px pb-12px sm:pb-16px text-white text-18px sm:text-20px leading-18px block">
                {data.title}
              </div>
              {data.links.map(item => (
                <a
                  class="pt-12px pb-12px sm:pb-16px text-white text-15px sm:text-16px leading-15px block hover:text-primary"
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
