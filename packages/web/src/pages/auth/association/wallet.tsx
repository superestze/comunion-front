import { UButton } from '@comunion/components'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import CardContent from '@/components/OAuth/CardContent'
import { ServiceReturn } from '@/services'
import { useUserStore, useWalletStore } from '@/stores'

export default defineComponent({
  name: 'WalletAssociation',
  setup() {
    const walletStore = useWalletStore()
    const userStore = useUserStore()
    const { push, replace } = useRouter()
    const walletAssociating = async () => {
      walletStore.openBindModal().then((data: ServiceReturn<'account@wallet-link'>) => {
        if (data?.token) {
          userStore.refreshToken(data.token)
          userStore.refreshMe()
        }
        if (data?.isProfiled) {
          replace('/startup/list')
          return
        }
        replace('/auth/register/simple')
      })
    }

    const cancelAssociation = () => {
      push('/auth/register/simple')
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
