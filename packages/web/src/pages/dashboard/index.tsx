import { UCard, UButton } from '@comunion/components'
import { FacebookFilled, LinkInFilled, PinterestFilled } from '@comunion/icons'
import { defineComponent, onMounted, ref } from 'vue'
import styles from './index.module.css'
import empty from '@/assets/empty.png'
import { useWallet } from '@/providers'
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
    const { wallet } = useWallet()
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
        avatar: 'LinkInFilled',
        label: 'linkedin',
        link: 'https://www.facebook.com'
      },
      {
        avatar: 'FacebookFilled',
        label: 'Facebook',
        link: 'https://www.linkedin.cn'
      },
      {
        avatar: 'PinterestFilled',
        label: 'Pinterest',
        link: 'https://www.pinterest.com/'
      }
    ]

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
                <div class={styles.socialLinks}>
                  <div class={styles.linksTitle}>Social links</div>
                  <div class={styles.linksContent}>
                    {socialLinks.map(link => {
                      return (
                        <div class={styles.linksContentItems}>
                          {link.avatar === 'FacebookFilled' ? (
                            <FacebookFilled class={styles.linksContentItemsAvatar} />
                          ) : (
                            ''
                          )}
                          {link.avatar === 'LinkInFilled' ? (
                            <LinkInFilled class={styles.linksContentItemsAvatar} />
                          ) : (
                            ''
                          )}
                          {link.avatar === 'PinterestFilled' ? (
                            <PinterestFilled class={styles.linksContentItemsAvatar} />
                          ) : (
                            ''
                          )}
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
                  <div class={styles.linksContent}>{`${wallet?.walletAddress?.substring(
                    0,
                    10
                  )}...${wallet?.walletAddress?.substring(wallet.walletAddress.length - 4)}`}</div>
                </div>
              </div>
            </div>
          </UCard>
        </div>
        <div class={styles.myActivates}>
          <UCard title="MY COMEUPS" size="small" class={styles.profileTitle}></UCard>
          <UCard title="MY BOUNTIES" size="small" class={styles.profileTitle}>
            <div class={styles.empty}>
              <img class={styles.emptyImg} src={empty} />
            </div>
          </UCard>
          <UCard title="My PROPOSALS" size="small" class={styles.profileTitle}>
            <div class={styles.empty}>
              <img class={styles.emptyImg} src={empty} />
            </div>
          </UCard>
          <UCard title="MY BOOKMARKS" size="small" class={styles.profileTitle}>
            <div class={styles.empty}>
              <img class={styles.emptyImg} src={empty} />
            </div>
          </UCard>
        </div>
      </div>
    )
  }
})

export default Dashboard
