import { ULogo } from '@comunion/components'
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import WalletAddress from '../Address'
import CreateBlock from '../Create'
import NetworkSwitcher from '../Network'
import UserAvatar from '../UserAvatar'

const TheHeader = defineComponent({
  name: 'TheHeader',
  setup() {
    const navigations = [
      {
        name: 'startup',
        url: '/startup/list'
      },
      {
        name: 'bounty',
        url: '/bounty/list',
        disabled: false
      },
      {
        name: 'finance',
        url: '/launch/list',
        disabled: true
      },
      {
        name: 'governance',
        url: '/governance/list',
        disabled: true
      }
    ]
    return () => (
      <div class="flex h-24.5 px-10 items-center">
        <RouterLink to="/welcome" class="mr-15">
          <ULogo height={32} withText theme="colorful" />
        </RouterLink>
        <div class="text-grey1 gap-x-10 inline-flex item-center">
          {navigations.map(nav => (
            <RouterLink
              key={nav.name}
              class={[
                'transition uppercase u-label1 hover:text-primary',
                nav.disabled ? '!text-grey4 cursor-default' : ''
              ]}
              activeClass="text-primary"
              to={nav.disabled ? '' : nav.url}
            >
              {nav.name}
            </RouterLink>
          ))}
        </div>
        <div class="flex ml-auto gap-x-2.5 items-center">
          <CreateBlock />
          <NetworkSwitcher />
          <WalletAddress />
          <UserAvatar />
        </div>
      </div>
    )
  }
})

export default TheHeader
