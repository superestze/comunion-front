import { UButton, ULogo } from '@comunion/components'
import { WalletOutlined } from '@comunion/icons'
import { defineComponent, watchEffect, ref } from 'vue'

import { useRoute } from 'vue-router'
import MoreNavigationPage from './components/More'
import logo from '@/assets/colorful.png'
import logo2 from '@/assets/colorful@2x.png'
import logo3 from '@/assets/colorful@3x.png'
import { OAuthSignWidget } from '@/components/OAuth'
import { useOnLoggedIn } from '@/hooks'
import { useUserStore, useWalletStore } from '@/stores'
import { UserResponse } from '@/types'

export default defineComponent({
  setup() {
    const { query, path } = useRoute()
    const walletStore = useWalletStore()
    const userStore = useUserStore()
    const onLogin = useOnLoggedIn()
    const loading = ref(false)

    const { ensureWalletConnected } = walletStore

    watchEffect(() => {
      if (userStore.profile) {
        onLogin({ token: userStore.token, ...userStore.profile } as UserResponse)
      }
      if (path === '/auth/association' || path === '/auth/login' || query.state) {
        return
      }
      if (userStore.inited && !userStore.isProfiled) {
        userStore.logout(false)
      }
    })

    return {
      loading,
      ensureWalletConnected
    }
  },
  render() {
    const walletLogin = async () => {
      this.loading = true
      try {
        await this.ensureWalletConnected(true)
      } catch (error) {
        // do nothing
      }
      this.loading = false
    }
    return (
      <>
        <div class="flex w-100vw h-100vh justify-center items-center bg-[#EDEDF2] <md:hidden">
          <MoreNavigationPage />
          <div class="flex w-1245px h-542px bg-white relative justify-end rounded-8px">
            <div class="flex flex-col absolute h-606px w-635px text-white bg-primary left-100px -top-32px pl-64px pt-162px rounded-2px">
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>Welcome to Comunion</p>
              <p class="mt-30px text-30px font-bold">The First</p>
              <p class="mt-16px text-30px font-bold">Permissionless Economic Network </p>
              <div class="mt-214px">
                <ULogo height={20} withText theme="white" />
              </div>
            </div>
            <div class="flex flex-col mr-101px w-308px">
              <div class="mx-auto w-48px h-48px mt-60px mb-20px">
                <img
                  src={logo}
                  srcset={`${logo}, ${logo2} 2x, ${logo3} 3x`}
                  alt="logo"
                  class="w-full"
                />
              </div>
              <p class="text-[#111111] text-28px font-bold text-center">Comunion</p>
              <p
                class="mt-54px mb-20px text-center"
                style={{
                  color: 'rgba(17, 17, 17, 0.6)'
                }}
              >
                WALLET
              </p>
              <UButton
                class="h-40px text-white text-16px w-full text-center relative mx-auto"
                size="small"
                type="primary"
                loading={this.loading}
                onClick={walletLogin}
              >
                <WalletOutlined class="h-20px w-20px absolute left-17px top-10px" />
                Connect to a wallet
              </UButton>
              <div class="flex mb-24px mt-40px items-center">
                <div class="bg-[#666] h-[1px] w-[140px]" />
                <div
                  class="text-[14px] leading-5 w-[40px] text-center"
                  style={{ color: 'rgba(17,17,17,0.6)' }}
                >
                  OR
                </div>
                <div class="bg-[#666] h-[1px] w-[140px]" />
              </div>
              <OAuthSignWidget />
            </div>
          </div>
        </div>
        <div class="flex flex-col w-100vw h-100vh bg-[#EDEDF2] md:hidden">
          <div class="mx-auto w-68px h-68px mt-100px mb-46px">
            <img
              src={logo}
              srcset={`${logo}, ${logo2} 2x, ${logo3} 3x`}
              alt="logo"
              class="w-full"
            />
          </div>
          <p class="text-[#111111] text-48px font-bold text-center">Comunion</p>
          <p class="mt-102px mb-32px text-center text-[#111111]/6">WALLET</p>
          <UButton
            class="h-96px text-white text-16px w-586px text-center relative mx-auto rounded-12px"
            size="small"
            type="primary"
            loading={this.loading}
            onClick={walletLogin}
          >
            <WalletOutlined class="h-32px w-32px absolute left-38px top-31px" />
            <span class="text-32px font-bold">Connect to a wallet</span>
          </UButton>
          <div class="flex my-60px items-center w-586px mx-auto">
            <div class="bg-[#666] h-[1px] flex-grow" />
            <div
              class="text-[26px] leading-5 w-[80px] text-center font-bold"
              style={{ color: 'rgba(17,17,17,0.6)' }}
            >
              OR
            </div>
            <div class="bg-[#666] h-[1px] flex-grow" />
          </div>
          <OAuthSignWidget />
        </div>
      </>
    )
  }
})
