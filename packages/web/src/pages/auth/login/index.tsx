import { UButton, ULogo } from '@comunion/components'
import { GithubFilled, GoogleFilled, WalletOutlined } from '@comunion/icons'
import { randomStr } from '@comunion/utils'
import { defineComponent } from 'vue'
import leftBgImg from './assets/bg.jpg'
import styles from './index.module.css'
import {
  GITHUB_CALLBACK_URL,
  GITHUB_CLIENT_ID,
  GOOGLE_CALLBACK_URL,
  GOOGLE_CLIENT_ID
} from '@/constants'
import { useOnLoggedIn } from '@/hooks'
import MoreNavigationPage from '@/pages/auth/login/components/More'
import { useUserStore, useWalletStore } from '@/stores'

const LoginPage = defineComponent({
  name: 'LoginPage',
  setup() {
    const isLocal = process.env.NODE_ENV === 'development'
    const walletStore = useWalletStore()
    const userStore = useUserStore()
    const state = randomStr()
    const onLogin = useOnLoggedIn()

    // const doLogout = () => {
    //   logout()
    // }

    const googleLogin = () =>
      (window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&scope=openid%20email&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&state=u${
        isLocal ? '0' : '1'
      }${state}`)

    const githubLogin = () =>
      (window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_CALLBACK_URL}&state=u${
        isLocal ? '0' : '1'
      }${state}`)

    const walletLogin = async () => {
      await walletStore.ensureWalletConnected()
      if (userStore.logged) {
        onLogin()
      }
    }

    return () => (
      <div class="flex min-h-screen">
        <div
          class="bg-primary bg-bottom bg-no-repeat bg-cover text-white min-w-100 px-5 pt-15 w-1/3 lg:px-10 2xl:pt-19 2xl:pl-12"
          style={{
            backgroundImage: `url(${leftBgImg})`
          }}
        >
          <ULogo height={32} withText theme="white" />
          <h1 class="mt-[90px] u-h1 !text-white">Incubate ZERO To ONE</h1>
          <h2 class="mt-[14px] text-[24px] leading-8 tracking-[1px]">Comunion is a metatech</h2>
          <p class="mt-10 text-base leading-[22px]">
            We reorganize labor,resources and capital in a decentralized way within the shared
            online space,and empower super individuals to change the world
          </p>
        </div>
        <div class="flex flex-col flex-1 pl-1/8 relative justify-center lg:pl-1/5">
          <MoreNavigationPage />
          <h2 class="text-[36px] leading-9">Sign to Comunion</h2>
          <UButton
            class="h-16 mt-[30px] text-white mb-3 text-[21px] w-105 relative"
            size="large"
            type="primary"
            onClick={walletLogin}
          >
            <WalletOutlined class="h-8 top-4 left-4 w-8 absolute" />
            Sign in with Wallet
          </UButton>
          <a class="text-primary">What is wallet？</a>
          <div class="flex my-10 items-center">
            <div class="bg-[#d8d8d8] h-[1px] w-[90px]" />
            <div class="mx-3 text-[#999] text-[18px] leading-5">Sign in with social accout</div>
            <div class="bg-[#d8d8d8] h-[1px] w-[90px]" />
          </div>
          <div class="flex items-center">
            <div class={styles.oauthBtn} onClick={googleLogin}>
              <GoogleFilled />
            </div>
            <div class={styles.oauthBtn} onClick={githubLogin}>
              <GithubFilled class="text-primary" />
            </div>
          </div>
        </div>
      </div>
    )
  }
})

export default LoginPage
