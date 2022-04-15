import { UButton, ULogo } from '@comunion/components'
import { PlusOutlined } from '@comunion/icons'
import { defineComponent } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import styles from './default.module.css'
import CreateStartupBlock from '@/blocks/Startup/Create'
import Footer from '@/pages/index/components/Footer'

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
          <div class="u-page-container">
            <Footer />
          </div>
        </div>
      </div>
    )
  }
})

export default DefaultLayout
