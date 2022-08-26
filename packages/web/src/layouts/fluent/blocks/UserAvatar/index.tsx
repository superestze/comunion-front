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
        router.push('/dashboard')
      }
    }
    return () =>
      userStore.logged ? (
        <HeaderDropdown
          placement="bottom-end"
          onSelect={onClick}
          options={[
            {
              key: 'dashboard',
              icon: () => <UserFilled class="!text-primary" />,
              label: () => <span class="text-primary hover:text-primary1">My Dashboard</span>
            },
            {
              key: 'logout',
              icon: () => <SignOutFilled class="bg-purple rounded-3xl !text-primary" />,
              label: () => <span class="text-primary hover:text-primary1">Sign out</span>
            }
          ]}
        >
          <ULazyImage
            src={userStore.profile?.avatar ?? ''}
            class="rounded-full cursor-pointer h-8 w-8"
          />
        </HeaderDropdown>
      ) : (
        <div />
      )
  }
})

export default UserAvatar
