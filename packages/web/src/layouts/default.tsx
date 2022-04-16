import { UButton, ULogo } from '@comunion/components'
import { PlusOutlined } from '@comunion/icons'
import { defineComponent } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import styles from './default.module.css'
import CreateStartupBlock from '@/blocks/Startup/Create'

const DefaultLayout = defineComponent({
  name: 'DefaultLayout',
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
            url: 'https://github.com/comunion-io'
          }
          // {
          //   title: 'Taiga',
          //   url: 'https://taiga.comunion.io'
          // }
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
      <div class="bg-purple flex flex-col h-full min-h-screen text-[14px] relative">
        <div class="flex-1 u-page-container">
          {/* Header */}
          <div class="flex h-24 items-center">
            <ULogo height={32} withText theme="colorful" />
            <RouterLink
              class="ml-22 transition u-label1 hover:text-primary"
              activeClass="text-primary"
              to="/startups"
            >
              STARTUPS
            </RouterLink>
            <CreateStartupBlock
              trigger={
                <UButton class="rounded-lg ml-auto h-40px text-primary w-33" type="primary" ghost>
                  <PlusOutlined class="h-4 mr-3 w-4" />
                  <span class="text-primary u-label1">CREATE</span>
                </UButton>
              }
            />
            <RouterLink to="/dashboard" class="text-primary ml-16 u-label1">
              MY DASHBOARD
            </RouterLink>
          </div>
          {/* Body */}
          <RouterView />
        </div>
        {/* Footer */}
        <div class={styles.footer}>
          <div class="border-t-white m-auto border-t-1px border-opacity-10 pb-28px w-311px sm:flex sm:pt-36px sm:pb-62px sm:w-1110px">
            {/* about us */}
            <RouterLink
              class="flex mt-30px text-white mb-16px items-center block sm:mt-0 sm:mr-126px sm:items-baseline"
              to="/"
            >
              <ULogo theme="colorful" height={25} />
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
        </div>
      </div>
    )
  }
})

export default DefaultLayout
