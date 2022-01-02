import { STORE_KEY_USER } from '@/constants'
import type { ComputedRef, InjectionKey } from 'vue'
import { computed, readonly, inject, provide, reactive, defineComponent } from 'vue'
import { readObject, removeObject, storeObject } from '@comunion/utils'

export interface UserProfileState {
  token: string
  avatar?: string
  name?: string
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

    function logout() {
      removeObject(STORE_KEY_USER)
      state.user = null
    }

    provide(UserProfileSymbol, {
      user: readonly(state),
      logged,
      setUser,
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
