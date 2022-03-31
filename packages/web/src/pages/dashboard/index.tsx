import { UCard } from '@comunion/components'
import { computed, defineComponent, onMounted, ref } from 'vue'
import Bookmarks from './components/Bookmarks'
import Bounties from './components/Bounties'
import Proposals from './components/Proposals'
import SocialLinks from './components/SocialLinks'
import Startups from './components/Startups'
import styles from './index.module.css'
import { useWallet } from '@/providers'
import { ServiceReturn, services } from '@/services'

const DashboardPage = defineComponent({
  name: 'Dashboard',
  setup() {
    const { wallet } = useWallet()
    const myProfile = ref<ServiceReturn<'account@comer-profile-get'>>()
    onMounted(async () => {
      const { error, data } = await services['account@comer-profile-get']()
      if (!error) {
        myProfile.value = data
      }
    })

    const myInfo = computed(() => {
      return [
        {
          label: 'Location',
          value: myProfile.value?.location
        },
        {
          label: 'Website',
          value: myProfile.value?.website
        },
        {
          label: 'Skills',
          value: myProfile.value?.skills.map(skill => skill.name).join(' | ')
        },
        {
          label: 'Bio',
          value: myProfile.value?.bio
        }
      ]
    })

    return () => (
      <div class={styles.dashboard}>
        <div class={styles.dashboardTitle}> dashboard </div>
        <div class={styles.dashboardMyProfile}>
          <UCard title="MY PROFILE" size="small" class={styles.cardTitle}>
            <div class="flex">
              <div class={styles.myProfileLeft}>
                <div class={styles.myWalletInfo}>
                  <img class={styles.avatar} src={myProfile.value?.avatar} />
                  <div>
                    <div class={styles.name}>{myProfile.value?.name}</div>
                    {/*TODO after wallet address component completed, replace this */}
                    <div class={styles.walletAddr}> {wallet?.walletAddress}</div>
                  </div>
                </div>
                <div class={styles.myInfo}>
                  {myInfo.value?.map(info => {
                    return (
                      <div class={styles.infoItem}>
                        <div class={styles.label}>{info.label}</div>
                        <div class={styles.value}>{info.value}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div class={styles.myProfileRight}>
                <SocialLinks />
              </div>
            </div>
          </UCard>
        </div>
        <div class={styles.myActivates}>
          <Startups />
          <Bounties />
          <Proposals />
          <Bookmarks />
        </div>
      </div>
    )
  }
})

export default DashboardPage
