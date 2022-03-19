import { UCard, UButton } from '@comunion/components'
import { defineComponent, onMounted, ref } from 'vue'
import styles from './index.module.css'

// TODO
import facebook from '@/assets/facebook.svg'
import linkin from '@/assets/linkin.svg'
import pinterest from '@/assets/pinterest.svg'
import { ServiceReturn, services } from '@/services'

interface startupParams {
  limit: any
  offset: any
  keyword: any
  /**
   * @description NONE,ESG,NGO,DAO,COM
   */
  mode: any
}

const Dashboard = defineComponent({
  name: 'Dashboard',
  props: {},
  setup() {
    // const {wallet} = useWallet()
    // console.log('%c 🍐 wallet: ', 'font-size:20px;background-color: #6EC1C2;color:#fff;', wallet.walletAddress);
    const myProfile = ref<ServiceReturn<'account@comer-profile-get'>>()
    const myCreatedStartups = ref<ServiceReturn<'startup@startup-list-me'>>()
    const myJoinStartups = ref<ServiceReturn<'startup@startup-list-followed'>>()

    const myStartupPages = {
      limit: 4,
      offset: 0,
      keyword: '',
      mode: 'NONE'
    }

    const myJoinStartupPages = {
      limit: 4,
      offset: 0,
      keyword: '',
      mode: 'NONE'
    }

    let myInfo: { label: string; value: string }[] = []

    onMounted(async () => {
      const { error, data } = await services['account@comer-profile-get']()
      if (!error) {
        myProfile.value = data
        handleMyInfo()
      }

      getCreatedStartups(myStartupPages)
      getMyJoinStartups(myJoinStartupPages)
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

    const getCreatedStartups = async (params: startupParams) => {
      const { error, data } = await services['startup@startup-list-followed'](params)
      if (!error) {
        myCreatedStartups.value = data
      }
    }

    const getMyJoinStartups = async (params: startupParams) => {
      const { error, data } = await services['startup@startup-list-me'](params)
      if (!error) {
        myJoinStartups.value = data
      }
    }

    const socialLinks = [
      {
        avatar: linkin,
        label: 'Facebook',
        link: 'https://www.linkedin.cn'
      },
      {
        avatar: facebook,
        label: 'linkedin',
        link: 'https://www.facebook.com'
      },
      {
        avatar: pinterest,
        label: 'Pinterest',
        link: 'https://www.pinterest.com/'
      }
    ]

    myProfile.value = {
      avatar: '',
      name: ''
    }

    return () => (
      <div class={styles.dashboard}>
        <div class={styles.dashboardTitle}> dashboard </div>
        <div class={styles.dashboardMyProfile}>
          <UCard title="MY PROFILE" class={styles.profileTitle}>
            <div class="flex">
              <div class={styles.myProfileLeft}>
                <div class={styles.myWalletInfo}>
                  <img class={styles.avatar} src={myProfile.value?.avatar} />
                  <div>
                    <div class={styles.name}>{myProfile.value?.name}</div>
                    <div class={styles.walletAddr}> {/* {myProfile.value.}{' '} */}</div>
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
                <div class={styles.socialLinks}>
                  <div class={styles.linksTitle}>Social links</div>
                  <div class={styles.linksContent}>
                    {socialLinks.map(link => {
                      return (
                        <div class={styles.linksContentItems}>
                          <img class={styles.linksContentItemsAvatar} src={link.avatar} />
                          <span class={styles.linksContentItemsLabel}>{link.label}</span>
                          <UButton
                            class={styles.linksContentItemsBtn}
                            size="small"
                            onClick={() => window.open(link.link)}
                          >
                            Connect
                          </UButton>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div class={styles.walletLinks}>
                  <div class={styles.linksTitle}>Associated Wallet Links</div>
                  {/* <div class={styles.linksContent}>{`${myProfile.value?.address.substring(
                    0,
                    10
                  )}...${myProfile.address.substring(myProfile.address.length - 4)}`}</div> */}
                </div>
              </div>
            </div>
          </UCard>
        </div>
        <div class={styles.myActivates}>
          <UCard title="MY COMEUPS" size="small" class={styles.profileTitle}></UCard>
          <UCard title="MY BOUNTIES" size="small" class={styles.profileTitle}></UCard>
          <UCard title="My PROPOSALS" size="small" class={styles.profileTitle}></UCard>
          <UCard title="MY BOOKMARKS" size="small" class={styles.profileTitle}></UCard>
        </div>
      </div>
    )
  }
})

export default Dashboard
