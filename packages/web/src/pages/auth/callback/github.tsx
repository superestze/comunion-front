import { services } from '@/services'
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

const GithubAuthCallbackPage = defineComponent({
  name: 'GithubAuthCallbackPage',
  setup() {
    const { query } = useRoute()
    if (query.code && query.state) {
      const isLocal = (query.state as string).match(/^u[01]/)?.[1] === '0'
      if (isLocal && !window.location.origin.match(/http:\/\/localhost/)) {
        window.location.href = `http://localhost:3000/auth/login/callback/github?code=${query.code}&state`
      } else {
        services['account@oauth-github-login-callback']({ code: query.code }).then(res => {
          if (!res.error) {
            console.log(res.data)
          }
        })
      }
    }
    return () => null
  }
})

export default GithubAuthCallbackPage
