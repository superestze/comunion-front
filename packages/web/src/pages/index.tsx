import { defineComponent } from 'vue'
// import { RouterLink } from 'vue-router'

export default defineComponent({
  name: 'HomePage',
  props: {},
  setup() {
    return () => (
      <div>
        <router-link class="block" to="/auth/github">
          Github Oauth
        </router-link>
        <router-link class="block" to="/auth/metamask">
          MetaMask Login
        </router-link>
        <router-link class="block" to="/auth/wallet-connect">
          WalletCollect Login
        </router-link>
      </div>
    )
  }
})
