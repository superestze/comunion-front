import { UButton } from '@comunion/components'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import CardContent from '@/components/OAuth/CardContent'
import { services } from '@/services'
import { useWalletStore } from '@/stores'
import { getItem } from '@/utils/storage'

export default defineComponent({
  name: 'WalletAssociation',
  setup() {
    const walletStore = useWalletStore()
    const { push, replace } = useRouter()
    const walletAssociating = async () => {
      await walletStore.ensureWalletConnected(true)
      const oauthAccountId = getItem<string | null>('oauth:temp:oauthAccountId')
      if (walletStore.address && oauthAccountId !== null) {
        try {
          const { error, data } = await services['account@oauth-link-wallet']({
            address: walletStore.address,
            oauthAccountId
          })
          if (!error && data.oauthLinked) {
            if (data.isProfiled) {
              replace('/welcome')
              return
            }
            replace('/auth/register/intro')
            return
          }
        } catch (error) {
          // todo
        }
      }
    }

    const cancelAssociation = () => {
      push('/auth/register/intro')
    }

    return () => (
      <CardContent
        title="Associating existing accounts"
        config={{ width: 524 }}
        v-slots={{
          content: () => (
            <p>
              If you already have data from another account at comunion, you can associate it with
              that account.
            </p>
          ),
          footer: () => (
            <div class="flex justify-end mt-40px">
              <UButton class="w-160px" onClick={cancelAssociation}>
                Cancel
              </UButton>
              <UButton type="primary" class="ml-10px w-160px" onClick={walletAssociating}>
                Connect Wallet
              </UButton>
            </div>
          )
        }}
      />
    )
  }
})
