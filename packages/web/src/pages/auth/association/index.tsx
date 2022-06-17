import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import AccountAssociation from './account'
import WalletAssociation from './wallet'

function shouldDisplayComponent(type: string) {
  if (type === 'wallet') {
    return <WalletAssociation />
  } else if (type === 'account') {
    return <AccountAssociation />
  } else {
    return null
  }
}

export default defineComponent({
  setup() {
    const { query } = useRoute()
    return () => (
      <div class="bg-purple h-full min-h-screen text-[14px] relative">
        <div class="u-page-container flex justify-center items-center h-100vh">
          {shouldDisplayComponent(query.type as string)}
        </div>
      </div>
    )
  }
})
