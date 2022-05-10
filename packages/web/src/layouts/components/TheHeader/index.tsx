import { ULogo } from '@comunion/components'
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import HeaderAddress from './components/Address'
import CreateBlock from './components/Create'
import NetworkSwitcher from './components/Network'

const TheHeader = defineComponent({
  name: 'TheHeader',
  setup(props, ctx) {
    return () => (
      <div class="flex h-24.5 items-center">
        <RouterLink to="/welcome">
          <ULogo height={32} withText theme="colorful" />
        </RouterLink>
        <RouterLink
          class="ml-20 transition u-label1 hover:text-primary"
          activeClass="text-primary"
          to="/startups"
        >
          STARTUPS
        </RouterLink>
        <CreateBlock class="ml-auto" />
        <NetworkSwitcher class="ml-6" />
        <HeaderAddress class="ml-6" />
        <RouterLink to="/dashboard" class="text-primary ml-10 u-label1">
          MY DASHBOARD
        </RouterLink>
      </div>
    )
  }
})

export default TheHeader
