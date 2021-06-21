import { GITHUB_CLIENT_ID } from '@/constants/oauth'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'GithubOauth',
  props: {},
  setup() {
    return () => (
      <a
        href={`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=http://localhost:3000/auth/github/callback`}
      >
        Github登录
      </a>
    )
  },
})
