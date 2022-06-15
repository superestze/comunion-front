import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import type { UserResponse } from '@/types'

export function useOnLoggedIn() {
  const { replace } = useRouter()
  const userStore = useUserStore()
  return (user?: UserResponse) => {
    if (user) {
      const { token, ..._user } = user
      userStore.onLogin(token, _user)
    }
    if (user?.comerID === 0) {
      replace('/auth/association?type=wallet')
      return
    }
    if (user?.isProfiled || userStore.isProfiled || user?.oauthLinked) {
      replace('/welcome')
    } else {
      replace('/auth/register/intro')
    }
  }
}
