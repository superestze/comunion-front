import { defineComponent } from 'vue'
import useCommonCallback from './_common'

const GoogleAuthCallbackPage = defineComponent({
  name: 'GoogleAuthCallbackPage',
  setup() {
    const errMsg = useCommonCallback('google', 'account@oauth-google-login-callback')

    return () => <div>{errMsg}</div>
  }
})

export default GoogleAuthCallbackPage
