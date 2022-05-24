import { UCard, ULazyImage, UTooltip, UButton } from '@comunion/components'
import { GithubFilled, GoogleFilled, ConnectFilled, ArrowRightOutlined } from '@comunion/icons'
import { computed, defineComponent, onMounted, ref } from 'vue'
import Bookmarks from './components/Bookmarks'
import Bounties from './components/Bounties'
import EditProfile from './components/EditProfile'
import FollowDateil from './components/FollowDateil'
import Proposals from './components/Proposals'
import Startups from './components/Startups'
import { ServiceReturn, services } from '@/services'
import { StartupItem } from '@/types'
// import { useWalletStore } from '@/stores'

const DashboardPage = defineComponent({
  name: 'Dashboard',
  setup() {
    // const walletStore = useWalletStore()
    const myProfile = ref<ServiceReturn<'account@comer-profile-get'>>()
    const folowDate = ref<StartupItem[]>([])
    const getDataList = async () => {
      const { error, data } = await services['account@comer-profile-get']()
      if (!error) {
        myProfile.value = data
      }
    }
    const getFollowList = async () => {
      const { error, data } = await services['startup@startup-list-followed']({
        limit: 99,
        offset: 0,
        keyword: null,
        mode: null
      })
      if (!error) {
        folowDate.value = !data || []
      }
    }
    onMounted(() => {
      // const { error, data } = await services['account@comer-profile-get']()
      // if (!error) {
      //   myProfile.value = data
      // }
      getDataList()
      getFollowList()
    })

    const myInfo = computed(() => {
      return [
        {
          label: 'Location',
          value: myProfile.value?.location || '--'
        },
        {
          label: 'Website',
          value: myProfile.value?.website
        },
        {
          label: 'Skills',
          value: myProfile.value?.skills?.map(skill => skill.name).join(' | ')
        },
        {
          label: 'Bio',
          value: myProfile.value?.bio
        }
      ]
    })

    const socialLinks = [
      {
        avatar: GoogleFilled,
        label: 'Google',
        link: 'https://accounts.google.com/'
      },
      {
        avatar: GithubFilled,
        label: 'Github',
        link: 'https://github.com/'
      }
    ]

    const style = {
      currency: 'u-body2 text-grey1 flex-1 break-all max-h-37 '
    }
    return () => (
      <div>
        <div class="mt-50px text-primary mb-10 u-h2">My Dashboard</div>
        <div class="flex">
          <div class="flex-1 mr-6">
            <UCard
              title="MY PROFILE"
              size="small"
              v-slots={{
                'header-extra': () =>
                  !!myProfile.value && (
                    <EditProfile myProfile={myProfile.value} getDataList={getDataList} />
                  )
              }}
            >
              <div class="flex border-b border-grey5 pt-6 pb-6">
                <div class="flex flex-col flex-1 mt-7 pr-8">
                  <div class="flex">
                    <ULazyImage class="rounded-1/2 h-20 w-20" src={myProfile.value?.avatar ?? ''} />
                    <div class="flex flex-col ml-5 justify-center">
                      <div class="mb-2 u-title1">{myProfile.value?.name}</div>
                      <div class="mb-2">{myInfo.value[2]?.value}</div>
                      <div class="mb-2 u-body2">{myProfile.value?.email}</div>
                      <div class="mb-2 u-body2">· {myProfile.value?.location}</div>
                      <div class="mb-2 u-body2">, {myProfile.value?.timeZone}</div>
                      {/* <div class="flex items-center">
                    <div class="rounded-full flex bg-grey3 h-5 text-white text-sm tracking-tighter w-5 items-center justify-center">
                      ID
                    </div>
                    {walletStore.address && (
                      <UAddress
                        autoSlice={true}
                        class="text-primary ml-1.5 u-body2"
                        blockchainExplorerUrl={walletStore.blockchainExplorerUrl}
                        address={walletStore.address}
                      />
                    )}
                  </div> */}
                    </div>
                  </div>
                  <div class="mt-2">
                    <div class="flex mb-3 break-words cursor-pointer max-w-145 max-h-25 leading-5 content break-all line-clamp-5">
                      <UTooltip showArrow={false} overlap={true} width={600}>
                        {/* <div class={[style.currency]}>{myInfo.value[3]?.value}</div> */}
                        {{
                          trigger: () => (
                            <div class={[style.currency]}>{myInfo.value[3]?.value}</div>
                          ),
                          default: () => myInfo.value[3]?.value
                        }}
                      </UTooltip>
                    </div>
                  </div>
                  <div class="mt-2">
                    {myProfile.value?.website && (
                      <div class="flex align-center cursor-pointer">
                        <ConnectFilled />
                        <span class=" pl-2 font-400 text-14px text-primary">
                          {myProfile.value?.website}
                        </span>
                      </div>
                    )}
                  </div>
                  <div class="mt-5 flex">
                    {socialLinks.map((link, index) => {
                      return (
                        <div class="mr-4" key={index}>
                          <UButton
                            disabled
                            class="ml-auto bg-white rounded-lg w-35 h-10"
                            size="small"
                            type="primary"
                            ghost
                            style={{
                              '--n-border': '1px solid var(--u-primary-color)'
                            }}
                          >
                            <link.avatar class="w-5 h-5 mr-3.5 text-primary" />
                            <span class="u-title2 text-primary">{link.label}</span>
                          </UButton>
                        </div>
                      )
                    })}
                  </div>
                  {/* <div class="mt-2">
                {myInfo.value?.map((info, i) => {
                  return (
                    <div key={info.label} class="flex mt-3 mb-3 break-words">
                      <div class="text-grey3 w-50 uppercase u-label2">{info.label}</div>
                      {i + 1 === 4 ? (
                        <UScrollbar class="flex-1">
                          <div class={[i + 1 === 4 ? 'h-148' : '', style.currency]}>
                            {info.value}
                          </div>
                        </UScrollbar>
                      ) : (
                        <div class={[i + 1 === 4 ? 'h-148' : '', style.currency]}>{info.value}</div>
                      )}
                    </div>
                  )
                })}
              </div> */}
                </div>
                {/* <div class="bg-purple rounded-lg flex flex-col p-4 px-6">
                  <SocialLinks />
                </div> */}
              </div>
              <div class="u-title1 text-primary1 mt-6 mb-6">Follow</div>
              <div class="flex">
                <div class="w-40 h-25 rounded-lg bg-violet-50 mr-4">
                  <div class="u-headline2 text-32px font-700 text-primary mt-4 ml-4">
                    {folowDate.value.length}
                  </div>
                  <div class="flex align-center ml-4 mt-4 cursor-pointer">
                    {folowDate.value.length ? (
                      <FollowDateil startup={folowDate.value} />
                    ) : (
                      <div class="u-body2 text-primary">Startup</div>
                    )}
                    <div class="flex-1"></div>
                    {folowDate.value.length ? (
                      <ArrowRightOutlined class="mt-1 mr-3 w-4 h-4 text-primary" />
                    ) : null}
                  </div>
                </div>
                <div class="w-40 h-25 rounded-lg bg-blue-50">
                  <div class="u-headline2 text-32px font-700 text-primary mt-4 ml-4">0</div>
                  <div class="flex align-center ml-4 mt-4 cursor-pointer">
                    <div class="u-body2 text-primary">Comer</div>
                    <div class="flex-1"></div>
                  </div>
                </div>
              </div>
            </UCard>
          </div>
          <div class="flex-1">
            <Startups class="bg-white border-lg border-1 border-grey5 h-155 box-border" />
          </div>
        </div>
        <div class="mt-6 mb-20">
          <div class="flex">
            <div class="flex-1  mr-6">
              <Bounties class="bg-white border-lg border-1 border-grey5 h-310 box-border" />
            </div>
            <div class="flex-1 flex flex-col">
              <Proposals class="bg-white border-lg border-1 border-grey5 h-153 box-border mb-4" />
              <Bookmarks class="bg-white border-lg border-1 border-grey5 h-153 box-border" />
            </div>
          </div>
        </div>
        {/* {count.value &&} */}
      </div>
    )
  }
})

export default DashboardPage
