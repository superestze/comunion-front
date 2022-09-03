import { ULogo } from '@comunion/components'
import { defineComponent, onMounted, onUnmounted, ref, computed } from 'vue'
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
        name: 'marketplace',
        url: '/bounty/list',
        disabled: false
      },
      {
        name: 'finance',
        url: '/crowdfunding/list'
      },
      {
        name: 'governance',
        url: '/governance/list'
      }
    ]

    const sticky = ref<string>('')
    const onScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > 0) {
        sticky.value = 'bg-white/80'
      } else {
        sticky.value = ''
      }
    }

    onMounted(() => {
      window.addEventListener('scroll', onScroll, true)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', onScroll, true)
    })

    const styles = computed(() => {
      if (sticky.value !== '') {
        return {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
          backdropFilter: 'blur(34px)'
        }
      }
      return {}
    })

    const headerClass = computed(() => {
      const str = 'flex h-16 px-10 items-center z-9 sticky top-0px'
      if (sticky.value !== '') {
        return `${str} ${sticky.value}`
      }
      return str
    })

    return () => (
      <div class={headerClass.value} style={styles.value}>
        <div class="mr-15">
          <ULogo height={20} withText theme="colorful" />
        </div>
        <div class="text-grey1 gap-x-6 inline-flex item-center">
          {navigations.map(nav => (
            <RouterLink
              key={nav.name}
              class={[
                'transition u-body2 font-bold capitalize',
                nav.disabled ? '!text-grey4 cursor-default' : 'text-primary1 hover:text-primary'
              ]}
              activeClass={[nav.disabled ? '' : '!text-primary'].join(' ')}
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
