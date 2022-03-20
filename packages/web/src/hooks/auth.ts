import { useRouter } from 'vue-router'
import { useUserProfile } from '@/providers'
import type { UserResponse } from '@/types'

export function useOnLoggedIn() {
  const { replace } = useRouter()
  const { setUserResponse } = useUserProfile()
  return (user: UserResponse) => {
    setUserResponse(user)
    if (user.isProfiled) {
      replace('/welcome')
    } else {
      replace('/auth/register/intro')
    }
  }
}
