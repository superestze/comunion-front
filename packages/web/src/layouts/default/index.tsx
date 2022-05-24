import { ULogo, UTransactionWaiting, UTransactionContainer } from '@comunion/components'
import { defineComponent, watchEffect } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import TheHeader from './blocks/TheHeader'
import styles from './index.module.css'
import { FOOTER_LINKS } from '@/constants'
import { useUserStore, useWalletStore } from '@/stores'
import { useContractStore } from '@/stores/contract'

const DefaultLayout = defineComponent({
  name: 'DefaultLayout',
  setup() {
    const router = useRouter()
    const walletStore = useWalletStore()
    const contractStore = useContractStore()
    const userStore = useUserStore()

    watchEffect(() => {
      if (!userStore.logged) {
        router.replace('/auth/login')
      }
    })

    return () => (
      <div class="bg-purple flex flex-col h-full min-h-screen text-[14px] relative">
        <TheHeader />
        <div class="flex-1 u-page-container relative">
          {/* Header */}
          {/* TransactionWaiting */}
          <UTransactionContainer>
            {contractStore.transacations.map(transaction => (
              <UTransactionWaiting
                key={transaction.hash}
                {...transaction}
                blockchainExplorerUrl={walletStore.blockchainExplorerUrl}
                onClose={() => contractStore.closeTransaction(transaction)}
              />
            ))}
          </UTransactionContainer>
          {/* Body */}
          <RouterView />
        </div>
        {/* Footer */}
        <div class={styles.footer}>
          <div class="border-t-white m-auto border-t-1px border-opacity-10 pb-28px w-311px sm:flex sm:pt-36px sm:pb-62px sm:w-1110px">
            {/* about us */}
            <RouterLink
              class="flex mt-30px text-white mb-16px items-center block sm:mt-0 sm:mr-126px sm:items-baseline"
              to="/"
            >
              <ULogo theme="colorful" height={25} />
              <span class="ml-16px text-24px leading-24px sm:ml-10px sm:text-30px">About us</span>
            </RouterLink>
            <div class="sm:flex sm:flex-1 sm:gap-40">
              {FOOTER_LINKS.map(data => (
                <div key={data.title} class="mb-40px">
                  <div class="text-white pt-12px pb-12px text-18px leading-18px block sm:pb-16px sm:text-20px">
                    {data.title}
                  </div>
                  {data.links.map(item => (
                    <a
                      class="text-white pt-12px pb-12px text-15px leading-15px block sm:pb-16px sm:text-16px hover:text-primary"
                      key={item.title}
                      href={item.url}
                      target="_blank"
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
})

export default DefaultLayout
