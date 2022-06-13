import { GithubFilled, GoogleFilled } from '@comunion/icons'
import { randomStr } from '@comunion/utils'
import { defineComponent } from 'vue'
import OAuthSignBtn from './OAuthSignBtn'
import {
  GITHUB_CALLBACK_URL,
  GITHUB_CLIENT_ID,
  GOOGLE_CALLBACK_URL,
  GOOGLE_CLIENT_ID
} from '@/constants'

export default defineComponent({
  name: 'OAuthSignWidget',
  setup() {
    const isLocal = process.env.NODE_ENV === 'development'

    const state = randomStr()
    const googleLogin = () =>
      (window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&scope=openid%20email&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&state=u${
        isLocal ? '0' : '1'
      }${state}`)

    const githubLogin = () =>
      (window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_CALLBACK_URL}&state=u${
        isLocal ? '0' : '1'
      }${state}`)

    return () => (
      <div class="flex items-center">
        <OAuthSignBtn onTriggerBtn={googleLogin}>
          <GoogleFilled />
        </OAuthSignBtn>
        <OAuthSignBtn onTriggerBtn={githubLogin}>
          <GithubFilled />
        </OAuthSignBtn>
      </div>
    )
  }
})
