import { useUserProfile } from '@/providers'
import type { UserResponse } from '@/types'
import { useRouter } from 'vue-router'

export default function useOnLogin() {
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
