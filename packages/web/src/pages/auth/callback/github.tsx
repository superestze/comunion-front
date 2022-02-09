import { defineComponent } from 'vue'
import useCommonCallback from './_common'

const GithubAuthCallbackPage = defineComponent({
  name: 'GithubAuthCallbackPage',
  setup() {
    const errMsg = useCommonCallback('github', 'account@oauth-github-login-callback')

    return () => <div>{errMsg}</div>
  }
})

export default GithubAuthCallbackPage
