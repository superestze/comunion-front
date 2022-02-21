import { UButton, ULogo } from '@comunion/components'
import { PlusOutlined } from '@comunion/icons'
import { defineComponent } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import styles from './default.module.css'

const DefaultLayout = defineComponent({
  name: 'DefaultLayout',
  setup() {
    return () => (
      <div class="bg-purple flex flex-col h-full min-h-screen text-[14px] relative">
        <div class="flex-1 u-page-container">
          {/* Header */}
          <div class="flex h-30 items-center">
            <ULogo height={40} withText theme="colorful" />
            <RouterLink class="ml-27 u-label1" activeClass="text-primary" to="/">
              STARTUPS
            </RouterLink>
            <UButton class="rounded-lg ml-auto h-10 text-primary w-33" type="primary" ghost>
              <PlusOutlined class="h-4 mr-3 w-4" />
              <span class="text-primary u-label1">CREATE</span>
            </UButton>
            <RouterLink to="/" class="text-primary ml-16 u-label1">
              MY DASHBOARD
            </RouterLink>
          </div>
          {/* Body */}
          <RouterView />
        </div>
        {/* Footer */}
        <div class={styles.footer}>
          <div class="flex py-20 u-page-container">
            <div class="flex flex-1">
              <ULogo theme="colorful" height={80} />
              <div class="flex flex-col ml-40">
                <div class="u-card-title1">ABOUT US</div>
                <a class="u-title1">Who we are</a>
                <a class="u-title1">Comunion Economics</a>
                <a class="u-title1">Our vision</a>
                <a class="u-title1">Contact us</a>
              </div>
            </div>
            <div class="flex flex-col flex-1">
              <div class="u-card-title1">COMMUNITY</div>
              <div class="flex">
                <div class="flex flex-col w-60">
                  <a class="u-title1">Wiki</a>
                  <a class="u-title1">BBS</a>
                  <a class="u-title1">Telegram</a>
                  <a class="u-title1">Twitter</a>
                </div>
                <div class="flex flex-col">
                  <a class="u-title1">Github</a>
                  <a class="u-title1">Yapi</a>
                  <a class="u-title1">Yuque</a>
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
