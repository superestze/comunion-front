import type { InjectionKey } from 'vue'
import { readonly, inject, provide, reactive, defineComponent } from 'vue'

export interface UserProfileState {
  token?: string
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

export const UserProfileSymbol: InjectionKey<UserProfileState> = Symbol()

export const UserProfileProvider = defineComponent({
  name: 'UserProfileProvider',
  setup(props, ctx) {
    const state = reactive<UserProfileState | undefined>(undefined)
    provide(UserProfileSymbol, readonly(state))
    return () => ctx.slots.default?.()
  }
})

export function useUserProfile() {
  const user = inject(UserProfileSymbol)
  if (!user) {
    throw new Error('useUserProfile should be used inside UserProfileProvider.')
  }

  async function loginWithGithub() {
    // TODO
  }

  async function loginWithGoogle() {
    // TODO
  }

  async function loginWithMetamask() {
    // TODO
  }

  async function loginWithWalletCollect() {
    // TODO
  }

  function logout() {
    // TODO
  }

  return {
    user,
    logged: !!user.token,
    loginWithGithub,
    loginWithGoogle,
    loginWithMetamask,
    loginWithWalletCollect,
    logout
  }
}
