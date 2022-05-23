import { readObject, removeObject, storeObject } from '@comunion/utils'
import { defineStore } from 'pinia'
import { STORE_KEY_TOKEN } from '@/constants'
import { services } from '@/services'
import { useWalletStore } from '@/stores'
import type { UserProfileState } from '@/types'
import AbstractWallet from '@/wallets/AbstractWallet'

export type UserState = {
  // inited
  inited: boolean
  // user token
  token: string | undefined
  // user profile
  profile: UserProfileState | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: readObject<string>(STORE_KEY_TOKEN),
    inited: false,
    profile: null
  }),
  getters: {
    logged: state => !!state.token,
    isProfiled: state => state.profile?.isProfiled
  },
  actions: {
    async init() {
      if (this.inited) return
      if (this.logged) {
        const { error, data } = await services['account@user-info']()
        if (!error) {
          this.profile = data
        } else {
          // anything to do?
        }
      }
      this.inited = true
    },
    setProfile(profile: UserProfileState) {
      this.profile = profile
    },
    mergeProfile(profile: Partial<UserProfileState>) {
      if (this.profile) {
        Object.assign(this.profile, profile)
      } else {
        this.profile = profile as UserProfileState
      }
    },
    async loginWithWalletAddress(wallet: AbstractWallet) {
      const address = await wallet.getAddress()
      const { error, data } = await services['account@wallet-nonce-get']({
        address
      })
      if (!error) {
        let signedMsg
        try {
          signedMsg = await wallet.sign(data!.nonce!)
        } catch (error) {
          console.error('Wallet sign errored')
          return
        }
        const { error: error2, data: data2 } = await services['account@wallet-login']({
          address,
          signature: signedMsg
        })
        if (!error2) {
          const { token, ...user } = data2!
          this.onLogin(token, user)
        } else {
          // TODO handle error
          console.error('Login failed when parse signature')
        }
      } else {
        // TODO handle error
        console.error('Login failed when get nonce')
      }
    },
    onLogin(token: string, profile: UserProfileState) {
      this.token = token
      this.profile = profile
      storeObject(STORE_KEY_TOKEN, token)
    },
    onLogout() {
      const walletStore = useWalletStore()
      this.token = ''
      this.profile = null
      removeObject(STORE_KEY_TOKEN)
      walletStore.disconnectWallet()
    }
  }
})
