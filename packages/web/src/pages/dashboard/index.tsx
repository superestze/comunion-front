import { UCard, ULazyImage, UTooltip, UScrollbar } from '@comunion/components'
import { ConnectOutlined } from '@comunion/icons'
import { computed, defineComponent, onMounted, ref, h } from 'vue'
import Bookmarks from './components/Bookmarks'
import Bounties from './components/Bounties'
import EditProfile from './components/EditProfile'
import FollowDateil from './components/FollowDateil'
import Proposals from './components/Proposals'
import Startups from './components/Startups'
import { OAuthLinkWidget } from '@/components/OAuth'
import { services } from '@/services'
import { useProfileStore } from '@/stores/profile'
// import { StartupItem } from '@/types'
// import { useWalletStore } from '@/stores'

const DashboardPage = defineComponent({
  name: 'Dashboard',
  setup() {
    const profileStore = useProfileStore()
    const followedStartups = ref<object[]>([])
    const getDataList = async () => {
      profileStore.get()
    }
    const getFollowList = async () => {
      const { error, data } = await services['startup@startup-list-followed']({
        limit: 99,
        offset: 0,
        keyword: null,
        mode: null
      })
      if (!error) {
        followedStartups.value = data.list ?? []
      }
    }
    onMounted(() => {
      getDataList()
      getFollowList()
    })

    const myProfile = computed(() => {
      return profileStore.value
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

    const style = {
      currency: 'u-body2 text-grey1 flex-1 break-all max-h-37 '
    }

    return () => (
      <div>
        <div class="mt-50px text-primary mb-10 u-h2">My Dashboard</div>
        <div class="flex mb-20">
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
                      <div class="mb-2 ">
                        <span class="u-body2">{myProfile.value?.email}</span>
                        <span class="u-body2">· {myProfile.value?.location}</span>
                        <span class="u-body2">· {myProfile.value?.timeZone}</span>
                      </div>

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
                      <UTooltip
                        showArrow={false}
                        overlap={true}
                        width={600}
                        style={{
                          background: 'rgba(var(--u-primary2-value), 0.8)',
                          padding: '0'
                        }}
                      >
                        {/* <div class={[style.currency]}>{myInfo.value[3]?.value}</div> */}
                        {{
                          trigger: () => (
                            <div class={[style.currency]}>{myInfo.value[3]?.value}</div>
                          ),
                          default: () => {
                            return h(
                              <UScrollbar
                                class="max-h-100 p-5"
                                themeOverrides={{
                                  color: 'var(--u-primary-2-color)',
                                  colorHover: 'var(--u-primary-2-color)'
                                }}
                              >
                                {myInfo.value[3]?.value}
                              </UScrollbar>
                            )
                          }
                        }}
                      </UTooltip>
                    </div>
                  </div>
                  <div class="mt-2">
                    {myProfile.value?.website && (
                      <div class="flex align-center cursor-pointer">
                        <ConnectOutlined class="text-primary" />
                        <a
                          href={myProfile.value?.website}
                          target="_blank"
                          class="pl-2 font-400 text-14px text-primary"
                        >
                          {myProfile.value?.website}
                        </a>
                      </div>
                    )}
                  </div>
                  <div class="mt-5 flex">
                    <OAuthLinkWidget comerAccounts={myProfile.value?.comerAccounts || []} />
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
              <div class="u-title1 text-primary1 mt-6 mb-6">Following</div>
              <div class="flex">
                <div class="w-40 h-25 rounded-lg bg-violet-50 mr-4">
                  <div class="u-headline2 text-32px font-700 text-primary mt-4 ml-4">
                    {followedStartups.value.length}
                  </div>
                  <div class="flex align-center ml-4 mt-4 cursor-pointer">
                    {followedStartups.value.length ? (
                      <FollowDateil startup={followedStartups.value} />
                    ) : (
                      <div class="u-body2 text-primary">Startup</div>
                    )}
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
            <Bounties class="bg-white border-lg border-1 border-grey5 h-301 h-auto box-border mt-6" />
          </div>
          <div class="flex-1">
            <Startups class="bg-white border-lg border-1 border-grey5 h-155 box-border " />
            <Proposals class="bg-white border-lg border-1 border-grey5 h-155 box-border mb-4 mt-6" />
            <Bookmarks class="bg-white border-lg border-1 border-grey5 h-155 box-border mt-6" />
          </div>
        </div>
        {/* <div class="mt-6 mb-20">
          <div class="flex">
            <div class="flex-1  mr-6">
              <Bounties class="bg-white border-lg border-1 border-grey5 h-310 box-border" />
            </div>
            <div class="flex-1 flex flex-col">
              <Proposals class="bg-white border-lg border-1 border-grey5 h-153 box-border mb-4" />
              <Bookmarks class="bg-white border-lg border-1 border-grey5 h-153 box-border" />
            </div>
          </div>
        </div> */}
        {/* {count.value &&} */}
      </div>
    )
  }
})

export default DashboardPage
