import { ULazyImage } from '@comunion/components'
import { SignOutFilled, UserFilled } from '@comunion/icons'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import HeaderDropdown from '../../components/HeaderDropdown'
import { useUserStore } from '@/stores'

const UserAvatar = defineComponent({
  name: 'UserAvatar',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const onClick = (v: string) => {
      if (v === 'logout') {
        userStore.logout()
      } else {
        router.push('/comer')
      }
    }
    return () =>
      userStore.logged ? (
        <HeaderDropdown
          placement="bottom-end"
          trigger="hover"
          onSelect={onClick}
          options={[
            {
              key: 'dashboard',
              icon: () => <UserFilled class="!text-primary" />,
              label: () => <span>My Dashboard</span>
            },
            {
              key: 'logout',
              icon: () => <SignOutFilled class="rounded-3xl !text-primary" />,
              label: () => <span>Sign out</span>
            }
          ]}
        >
          <div
            class="rounded-full cursor-pointer h-8 w-8 overflow-hidden"
            onClick={() => router.push('/comer')}
          >
            <ULazyImage src={userStore.profile?.avatar ?? ''} class="h-full w-full" />
          </div>
        </HeaderDropdown>
      ) : (
        <div />
      )
  }
})

export default UserAvatar
