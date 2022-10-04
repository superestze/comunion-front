import { ULogo, UTransactionContainer, UTransactionWaiting } from '@comunion/components'
import { defineComponent, watchEffect } from 'vue'
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import TheHeader from './blocks/TheHeader'
import { FOOTER_LINKS } from '@/constants'
import { useUserStore, useWalletStore } from '@/stores'
import { useContractStore } from '@/stores/contract'

const DefaultLayout = defineComponent({
  name: 'DefaultLayout',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const walletStore = useWalletStore()
    const contractStore = useContractStore()
    const userStore = useUserStore()

    watchEffect(() => {
      if (!userStore.logged) {
        userStore.logout(false)
        router.replace('/auth/login')
      } else if (!userStore.isProfiled) {
        if (!route.path.startsWith('/auth')) {
          router.replace('/auth/register/simple')
        }
      }
    })

    return () => (
      <div class="bg-white flex flex-col h-full min-h-screen text-[14px] relative">
        <TheHeader />
        <div class="flex-1 u-page-container relative">
          {/* Header */}
          {/* TransactionWaiting */}
          <UTransactionContainer>
            {contractStore.transacations.map(transaction => {
              return (
                <UTransactionWaiting
                  key={transaction.hash}
                  {...transaction}
                  blockchainExplorerUrl={walletStore.blockchainExplorerUrl}
                  onClose={() => contractStore.closeTransaction(transaction)}
                />
              )
            })}
          </UTransactionContainer>
          {/* Body */}
          <RouterView key={route.fullPath} />
        </div>
        {/* Footer */}
        <div class="bg-[#F0F0F0] text-color2">
          <div class="flex py-15 u-page-container relative items-start">
            {/* about us */}
            <RouterLink class="flex flex-1 items-center" to="/">
              <ULogo theme="colorful" height={32} />
              <span class=" ml-5 u-h3 ">ABOUT US</span>
            </RouterLink>
            {FOOTER_LINKS.map(data => (
              <div key={data.title} class="flex-1">
                <div class="mb-2 u-h4">{data.title.toUpperCase()}</div>
                {data.links.map(item => (
                  <a
                    class="mt-4 block u-h6 hover:text-color1"
                    key={item.title}
                    href={item.url}
                    target="_blank"
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            ))}
            {/* 版本号 */}
            <span class="text-white right-4 bottom-15 absolute">V5.7. Aug 2022</span>
          </div>
        </div>
      </div>
    )
  }
})

export default DefaultLayout
