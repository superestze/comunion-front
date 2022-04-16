import { UButton, ULogo } from '@comunion/components'
import { PlusOutlined } from '@comunion/icons'
import { defineComponent } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import styles from './default.module.css'
import CreateStartupBlock from '@/blocks/Startup/Create'
import UserAvatar from '@/components/UserAvatar'
import WalletInfo from '@/components/WalletInfo'

const DefaultLayout = defineComponent({
  name: 'DefaultLayout',
  setup() {
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
            <CreateStartupBlock>
              <UButton class="rounded-lg ml-auto h-40px text-primary w-33" type="primary" ghost>
                <PlusOutlined class="h-4 mr-3 w-4" />
                <span class="text-primary u-label1">CREATE</span>
              </UButton>
            </CreateStartupBlock>
            <RouterLink to="/dashboard" class="text-primary ml-16 u-label1">
              MY DASHBOARD
            </RouterLink>
            <UserAvatar class="ml-4" />
            <WalletInfo class="ml-2" />
          </div>
          {/* Body */}
          <RouterView />
        </div>
        {/* Footer */}
        <div class={styles.footer}>
          <div class="flex py-12 u-page-container">
            <div class="flex flex-1">
              <ULogo theme="colorful" height={56} />
              <div class="flex flex-col ml-40">
                <div class="u-card-title1">ABOUT US</div>
                <a target="_black" class="u-title1">
                  Who we are
                </a>
                <a target="_black" class="u-title1">
                  Comunion Economics
                </a>
                <a target="_black" class="u-title1">
                  Our vision
                </a>
                <a target="_black" class="u-title1">
                  Contact us
                </a>
              </div>
            </div>
            <div class="flex flex-col flex-1">
              <div class="u-card-title1">COMMUNITY</div>
              <div class="flex">
                <div class="flex flex-col w-60">
                  <a target="_black" href="https://docs.comunion.org" class="u-title1">
                    DOCS
                  </a>
                  <a target="_black" href="https://twitter.com/Comunion01" class="u-title1">
                    Twitter
                  </a>
                  <a target="_black" href="https://discord.gg/9x4Up6aWRj" class="u-title1">
                    Discord
                  </a>
                </div>
                <div class="flex flex-col">
                  <a target="_black" href="https://github.com/comunion-io" class="u-title1">
                    Github
                  </a>
                  <a target="_black" href="https://taiga.comunion.io" class="u-title1">
                    Taiga
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

export default DefaultLayout
