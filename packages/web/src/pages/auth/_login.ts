import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import type { UserResponse } from '@/types'

export default function useOnLoggedIn() {
  const { replace } = useRouter()
  const userStore = useUserStore()
  return (user: UserResponse) => {
    userStore.setProfile(user)
    if (user.isProfiled) {
      replace('/startup/list')
    } else {
      replace('/auth/register/simple')
    }
  }
}
