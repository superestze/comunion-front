import { storage } from '@comunion/utils'
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
    const result = storage('session').get('link:btn')
    if (result && (result === 'google' || result === 'github')) {
      replace('/comer')
      storage('session').remove('link:btn')
      userStore.refreshMe()
      return
    }
    // if (user?.firstLogin) {
    //   replace('/auth/association?type=account')
    //   return
    // }
    // if (!user?.address) {
    //   replace('/auth/association?type=wallet')
    //   return
    // }
    if (user?.isProfiled || userStore.isProfiled || user?.oauthLinked) {
      replace('/welcome')
    } else {
      replace('/auth/register/simple')
    }
  }
}
