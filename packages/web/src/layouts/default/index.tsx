import { ULogo, UTransactionContainer, UTransactionWaiting } from '@comunion/components'
import { defineComponent, watchEffect } from 'vue'
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import TheHeader from './blocks/TheHeader'
import styles from './index.module.css'
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
      }
    })

    return () => (
      <div class="bg-purple flex flex-col h-full min-h-screen text-[14px] relative">
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
        <div class={styles.footer}>
          <div class="border-t-white m-auto border-t-1px border-opacity-10 pb-28px w-311px sm:flex sm:pt-36px sm:pb-62px sm:w-1110px">
            {/* about us */}
            <RouterLink
              class="flex mt-30px text-white mb-16px items-center block sm:mt-0 sm:mr-126px sm:items-baseline"
              to="/"
            >
              <ULogo theme="colorful" height={32} />
              <span class="text-white ml-5 u-h3 ">ABOUT US</span>
            </RouterLink>
            <div class="relative sm:flex sm:flex-1 sm:gap-40">
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
              {/* 版本号 */}
              <span class="text-white footer-links-vertion">V5.7. Aug 2022</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

export default DefaultLayout
