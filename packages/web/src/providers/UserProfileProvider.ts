import { readObject, removeObject, storeObject } from '@comunion/utils'
import type { ComputedRef, InjectionKey } from 'vue'
import {
  computed,
  readonly,
  inject,
  ref,
  provide,
  reactive,
  defineComponent,
  onBeforeMount
} from 'vue'
import { STORE_KEY_TOKEN } from '@/constants'
import { services } from '@/services'
import { setToken } from '@/services/a2s.adapter'
import type { UserResponse } from '@/types'

export interface UserProfileState {
  token: string
  avatar?: string
  name?: string
  isProfiled?: boolean
  location?: string
  website?: string
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
    const storedToken = readObject<string>(STORE_KEY_TOKEN)
    setToken(storedToken)
    const state = reactive<{ user: UserProfileState | undefined }>({ user: undefined })
    const ready = ref(false)

    const logged = computed<boolean>(() => !!state.user?.token)

    function setUser(newUser: UserProfileState) {
      state.user = newUser
      state.user.token = newUser.token || storedToken
      if (newUser.token) {
        setToken(newUser.token)
        // @ts-ignore
        storeObject(STORE_KEY_TOKEN, newUser.token)
      }
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
      removeObject(STORE_KEY_TOKEN)
      setToken(null)
      state.user = null
    }

    onBeforeMount(async () => {
      if (storedToken) {
        const { error, data } = await services['account@user-info']()
        if (error) {
          logout()
        } else {
          setUserResponse(data)
        }
      }
      ready.value = true
    })

    provide(UserProfileSymbol, {
      user: readonly(state),
      logged,
      setUser,
      setUserResponse,
      logout
    })

    return () => (ready.value ? ctx.slots.default?.() : null)
  }
})

export function useUserProfile() {
  const state = inject(UserProfileSymbol)
  if (!state) {
    throw new Error('useUserProfile should be used inside UserProfileProvider.')
  }

  return state
}
