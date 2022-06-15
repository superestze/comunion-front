import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import AccountAssociation from './account'
import WalletAssociation from './wallet'

export default defineComponent({
  setup() {
    const { query } = useRoute()
    return () => (
      <div class="bg-purple h-full min-h-screen text-[14px] relative">
        <div class="u-page-container flex justify-center items-center h-100vh">
          {query.type === 'wallet' && <WalletAssociation />}
          {query.type === 'account' && <AccountAssociation />}
        </div>
      </div>
    )
  }
})
