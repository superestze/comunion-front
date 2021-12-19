import { defineComponent } from 'vue'
import {
  GITHUB_CALLBACK_URL,
  GITHUB_CLIENT_ID,
  GOOGLE_CALLBACK_URL,
  GOOGLE_CLIENT_ID
} from '@/constants'
import { randomStr } from '@comunion/utils'
import { useWallet } from '@/providers'

const LoginPage = defineComponent({
  name: 'LoginPage',
  setup() {
    const isLocal = process.env.NODE_ENV === 'development'
    const state = randomStr()
    const { walletLogin } = useWallet()

    const metamaskLogin = () => {
      walletLogin('Metamask')
    }

    const walletConnectLogin = () => {
      walletLogin('WalletConnect')
    }

    return () => (
      <div class="p-4">
        <div class="flex">
          <div class="mr-2">
            <button class="rounded bg-blue-500 text-white py-1 px-2" onClick={metamaskLogin}>
              MetaMask
            </button>
          </div>
          <div>
            <button class="rounded bg-blue-500 text-white py-1 px-2" onClick={walletConnectLogin}>
              Wallet Collect
            </button>
          </div>
        </div>
        <hr class="my-4" />
        <div class="flex">
          <div class="mr-2">
            <a
              class="rounded bg-blue-500 text-white py-1 px-2"
              href={`https://accounts.google.com/o/oauth2/v2/auth?response_type=code&scope=openid%20email&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&state=u${
                isLocal ? '0' : '1'
              }${state}`}
            >
              Google
            </a>
          </div>
          <div>
            <a
              class="rounded bg-blue-500 text-white py-1 px-2"
              href={`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_CALLBACK_URL}&state=u${
                isLocal ? '0' : '1'
              }${state}`}
            >
              Github
            </a>
          </div>
        </div>
      </div>
    )
  }
})

export default LoginPage
