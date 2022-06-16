import { UButton, ULogo } from '@comunion/components'
import { WalletOutlined } from '@comunion/icons'
import { defineComponent, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import leftBgImg from './assets/bg.png'
import { OAuthSignWidget } from '@/components/OAuth'
import { useOnLoggedIn } from '@/hooks'
import MoreNavigationPage from '@/pages/auth/login/components/More'
import { useUserStore, useWalletStore } from '@/stores'
import { UserResponse } from '@/types'

const LoginPage = defineComponent({
  name: 'LoginPage',
  setup() {
    const { query, path } = useRoute()
    const walletStore = useWalletStore()
    const userStore = useUserStore()
    const onLogin = useOnLoggedIn()
    const loading = ref(false)

    const walletLogin = async () => {
      loading.value = true
      try {
        await walletStore.ensureWalletConnected(true)
      } catch (error) {
        // do nothing
      }
      loading.value = false
    }

    watchEffect(() => {
      if (userStore.profile) {
        onLogin({ token: userStore.token, ...userStore.profile } as UserResponse)
      }
      if (path === '/auth/association' || !query.state) {
        return
      }
      if (userStore.inited && !userStore.isProfiled) {
        userStore.logout(false)
      }
    })

    return () => (
      <div class="flex min-h-screen">
        <div class="bg-primary flex-shrink-0 text-white px-13 pt-14 w-108 relative overflow-hidden lg:px-14 lg:w-114 2xl:px-15 2xl:pt-17 2xl:w-118">
          <div class="z-1 relative">
            <ULogo height={32} withText theme="white" />
            <h1 class="mt-16.5 u-h3 !text-white 2xl:mt-18 2xl:u-h2">Incubate ZERO To ONE</h1>
            <h2 class="mt-6.5 text-white u-title2 2xl:u-title1">Comunion is a startup protocol</h2>
            <p class="mt-2.5 text-white u-body2 2xl:u-body1">
              A revolutionary decentralized multi-chain protocol dedicated to building a thriving
              and collaborative work ecosystem, community and economy.
            </p>
          </div>
          <img
            src={leftBgImg}
            class="object-cover mb-[8vh] transform transition bottom-2 left-1/2 w-100 -translate-x-50 translate-y-12 absolute lg:w-104 lg:-translate-x-52 2xl:w-108 2xl:-translate-x-54"
          />
        </div>
        <div class="flex flex-col flex-1 px-1/8 relative justify-center lg:pl-1/5">
          <div class="mx-auto w-105">
            <MoreNavigationPage />
            <h2 class="text-[36px] leading-9">Sign to Comunion</h2>
            <UButton
              class="h-16 mt-[30px] text-white mb-3 text-[21px] w-105 relative"
              size="large"
              type="primary"
              loading={loading.value}
              onClick={walletLogin}
            >
              <WalletOutlined class="h-8 top-4 left-4 w-8 absolute" />
              Sign in with Wallet
            </UButton>
            {/* <a class="text-primary">What is wallet？</a> */}
            <div class="flex my-10 items-center">
              <div class="bg-[#d8d8d8] h-[1px] w-[90px]" />
              <div class="mx-3 text-[#999] text-[18px] leading-5 w-[230px]">
                Sign in with social account
              </div>
              <div class="bg-[#d8d8d8] h-[1px] w-[90px]" />
            </div>
            <OAuthSignWidget />
          </div>
        </div>
      </div>
    )
  }
})

export default LoginPage
