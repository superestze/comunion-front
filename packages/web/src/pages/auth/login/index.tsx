import { UButton, ULogo } from '@comunion/components'
import { WalletOutlined } from '@comunion/icons'
import { defineComponent, watchEffect, ref } from 'vue'

import { useRoute } from 'vue-router'
import styles from './animate.module.css'
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
      if (userStore.profile && !userStore.isProfiled) {
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
        <div class="flex bg-[#EDEDF2] h-100vh w-100vw justify-center items-center">
          <MoreNavigationPage />
          <div class="bg-white flex rounded-8px flex-1 h-542px max-w-1245px">
            <div
              class={`${styles.bgImage} bg-primary rounded-2px h-606px -mt-8 text-white ml-25 pt-212px pl-64px w-635px`}
            >
              <p
                style={{ color: 'rgba(255,255,255,0.5)', 'font-family': 'auto' }}
                class="text-[16px]"
              >
                The First
              </p>
              <p class="font-bold mt-10px text-30px">Permissionless Economic Network </p>
              <p class="font-bold mt-8px text-20px">to narrow the gap between rich and poor</p>
              <div class="mt-214px">
                <ULogo height={20} withText theme="white" />
              </div>
            </div>
            <div class="flex-1">
              <div class="mx-auto w-308px">
                <div class="mx-auto h-48px mt-60px mb-20px w-48px">
                  <img
                    src={logo}
                    srcset={`${logo}, ${logo2} 2x, ${logo3} 3x`}
                    alt="logo"
                    class="w-full"
                  />
                </div>
                <p class="font-bold text-center text-[#111111] text-28px">Comunion</p>
                <p
                  class="mt-54px text-center mb-20px"
                  style={{
                    color: 'rgba(17, 17, 17, 0.6)'
                  }}
                >
                  WALLET
                </p>
                <UButton
                  class="mx-auto h-40px text-white text-center w-full text-16px relative"
                  size="small"
                  type="primary"
                  loading={this.loading}
                  onClick={walletLogin}
                >
                  <WalletOutlined class="h-20px top-10px left-17px w-20px absolute" />
                  Connect to a wallet
                </UButton>
                <div class="flex mt-10 mb-24px items-center">
                  <div class="bg-[#666] h-[1px] w-[140px]" />
                  <div
                    class="text-center text-[14px] leading-5 w-[40px]"
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
        </div>
        {/* <div class="flex flex-col bg-[#EDEDF2] h-100vh w-100vw hidden">
          <div class="mx-auto h-17 mt-25 mb-11.5 w-17">
            <img
              src={logo}
              srcset={`${logo}, ${logo2} 2x, ${logo3} 3x`}
              alt="logo"
              class="w-full"
            />
          </div>
          <p class="font-bold text-center text-[#111111] text-[3rem]">Comunion</p>
          <p class="mt-25.5 text-center mb-8 text-[#111111]/6">WALLET</p>
          <UButton
            class="mx-auto rounded-3 h-24 text-white text-center text-4 w-146.5 relative"
            size="small"
            type="primary"
            loading={this.loading}
            onClick={walletLogin}
          >
            <WalletOutlined class="h-8 top-8 left-9.5 w-8 absolute" />
            <span class="font-bold text-8">Connect to a wallet</span>
          </UButton>
          <div class="flex mx-auto my-15 w-146.5 items-center">
            <div class="flex-grow bg-[#666] h-[1px]" />
            <div
              class="font-bold text-center text-[1.625rem] leading-5 w-20"
              style={{ color: 'rgba(17,17,17,0.6)' }}
            >
              OR
            </div>
            <div class="flex-grow bg-[#666] h-[1px]" />
          </div>
          <OAuthSignWidget />
        </div> */}
      </>
    )
  }
})
