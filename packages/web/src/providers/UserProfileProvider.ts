import { STORE_KEY_USER } from '@/constants'
import type { ComputedRef, InjectionKey } from 'vue'
import { computed, readonly, inject, provide, reactive, defineComponent } from 'vue'
import { readObject, removeObject, storeObject } from '@comunion/utils'
import type { UserResponse } from '@/types'

export interface UserProfileState {
  token: string
  avatar?: string
  name?: string
  isProfiled?: boolean
  location?: string
  homepage?: string
  skills?: string[]
  bio?: string
  oauth?: {
    github?: string
    google?: string
  }
  walletAddress?: string
}

export const UserProfileSymbol: InjectionKey<{
  user: Readonly<{ user: UserProfileState }>
  logged: ComputedRef<boolean>
  setUser: (user?: UserProfileState) => void
  setUserResponse: (user?: UserResponse) => void
  logout: () => void
}> = Symbol()

export const UserProfileProvider = defineComponent({
  name: 'UserProfileProvider',
  setup(props, ctx) {
    const stored = readObject<UserProfileState>(STORE_KEY_USER)
    const state = reactive<{ user: UserProfileState | undefined }>({ user: stored })

    const logged = computed<boolean>(() => !!state.user?.token)

    function setUser(newUser: UserProfileState) {
      state.user = newUser
      storeObject(STORE_KEY_USER, newUser)
    }

    function setUserResponse(newUser: UserResponse) {
      const user = {
        token: newUser.token,
        avatar: newUser.avatar,
        name: newUser.nick,
        isProfiled: newUser.isProfiled,
        walletAddress: newUser.address
      }
      setUser(user)
    }

    function logout() {
      removeObject(STORE_KEY_USER)
      state.user = null
    }

    provide(UserProfileSymbol, {
      user: readonly(state),
      logged,
      setUser,
      setUserResponse,
      logout
    })

    return () => ctx.slots.default?.()
  }
})

export function useUserProfile() {
  const state = inject(UserProfileSymbol)
  if (!state) {
    throw new Error('useUserProfile should be used inside UserProfileProvider.')
  }

  return state
}
