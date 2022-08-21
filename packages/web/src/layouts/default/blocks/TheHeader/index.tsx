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
        url: '/crowdfunding/list'
      },
      {
        name: 'governance',
        url: '/governance/list',
        disabled: true
      }
    ]
    return () => (
      <div
        class="flex h-16 px-10 items-center bg-white/80 sticky top-0px z-9"
        style={{
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
          backdropFilter: 'blur(34px)'
        }}
      >
        <RouterLink to="/welcome" class="mr-15">
          <ULogo height={20} withText theme="colorful" />
        </RouterLink>
        <div class="text-grey1 gap-x-6 inline-flex item-center">
          {navigations.map(nav => (
            <RouterLink
              key={nav.name}
              class={[
                'transition uppercase u-body2 hover:text-primary',
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
