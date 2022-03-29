import { UCard } from '@comunion/components'
import { defineComponent, onMounted, ref } from 'vue'
import Bookmarks from './components/Bookmarks'
import Bounties from './components/Bounties'
import Comeups from './components/Comeups'
import Proposals from './components/Proposals'
import SocialLinks from './components/SocialLinks'
import styles from './index.module.css'
import { useWallet } from '@/providers'
import { ServiceReturn, services } from '@/services'

const Dashboard = defineComponent({
  name: 'Dashboard',
  props: {},
  components: { Comeups },
  setup() {
    const { wallet } = useWallet()
    const myProfile = ref<ServiceReturn<'account@comer-profile-get'>>()
    let myInfo: { label: string; value: string }[] = []

    onMounted(async () => {
      const { error, data } = await services['account@comer-profile-get']()
      if (!error) {
        myProfile.value = data
        handleMyInfo()
      }
    })

    const handleMyInfo = () => {
      myInfo = [
        {
          label: 'location',
          value: myProfile.value?.location
        },
        {
          label: 'Website',
          value: myProfile.value?.website
        },
        {
          label: 'skills',
          value: myProfile.value?.skills.map(skill => skill.name).join(' | ')
        },
        {
          label: 'BIO',
          value: myProfile.value?.bio
        }
      ]
    }

    return () => (
      <div class={styles.dashboard}>
        <div class={styles.dashboardTitle}> dashboard </div>
        <div class={styles.dashboardMyProfile}>
          <UCard title="MY PROFILE" size="small" class={styles.profileTitle}>
            <div class="flex">
              <div class={styles.myProfileLeft}>
                <div class={styles.myWalletInfo}>
                  <img class={styles.avatar} src={myProfile.value?.avatar} />
                  <div>
                    <div class={styles.name}>{myProfile.value?.name}</div>
                    <div class={styles.walletAddr}> {wallet?.walletAddress}</div>
                  </div>
                </div>
                <div class={styles.myInfo}>
                  {myInfo.map(info => {
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
                <SocialLinks></SocialLinks>
              </div>
            </div>
          </UCard>
        </div>
        <div class={styles.myActivates}>
          <Comeups></Comeups>
          <Bounties></Bounties>
          <Proposals></Proposals>
          <Bookmarks></Bookmarks>
        </div>
      </div>
    )
  }
})

export default Dashboard
