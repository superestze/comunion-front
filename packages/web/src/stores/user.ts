import { message } from '@comunion/components'
import { storage } from '@comunion/utils'
import { defineStore } from 'pinia'
import { STORE_KEY_TOKEN } from '@/constants'
import router from '@/router'
import { services } from '@/services'
import { useWalletStore } from '@/stores'
import type { UserProfileState, UserResponse } from '@/types'
import AbstractWallet from '@/wallets/AbstractWallet'

export type UserState = {
  // user token
  token: string | undefined
  // user profile
  profile: UserProfileState | null
  // user signin response
  userResponse: UserResponse | null
  // comer profile
  comerProfile: UserProfileState | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: storage('local').get<string>(STORE_KEY_TOKEN),
    profile: null,
    userResponse: null,
    comerProfile: null
  }),
  getters: {
    logged: state => !!state.token,
    isProfiled: state => state.profile?.isProfiled
  },
  actions: {
    async init(reload = false) {
      if (!reload && this.profile) return this.profile
      if (this.logged) {
        const { error, data } = await services['account@user-info']()
        if (!error) {
          this.profile = data as unknown as UserProfileState
          return this.profile
        } else {
          // anything to do?
          return null
        }
      } else {
        return null
      }
    },
    async getComerProfile(reload = false) {
      if (!reload && this.comerProfile) return this.comerProfile
      if (this.logged) {
        const { error, data } = await services['account@comer-profile-get']()
        if (!error) {
          this.comerProfile = data
          return this.comerProfile
        } else {
          // anything to do?
          return null
        }
      } else {
        return null
      }
    },
    refreshToken(token?: string) {
      this.token = token || storage('local').get<string>(STORE_KEY_TOKEN)
      storage('local').set(STORE_KEY_TOKEN, this.token as string)
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
          this.onLogin(token, user as unknown as UserProfileState)
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
      this.userResponse = profile as UserResponse
      storage('session').set('oauth:info', this.userResponse)
      storage('local').set(STORE_KEY_TOKEN, token)
    },
    onLogout() {
      const walletStore = useWalletStore()
      this.token = ''
      this.profile = null
      this.userResponse = null
      storage('session').clear()
      storage('local').remove(STORE_KEY_TOKEN)
      walletStore.disconnectWallet()
    },
    logout(msg?: false | string) {
      this.onLogout()
      if (msg) {
        message.info(typeof msg === 'string' ? msg : 'You have been logged out')
      }
      router.replace('/auth/login')
    }
  }
})
