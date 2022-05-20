import { UCard, ULazyImage, UTooltip, UButton } from '@comunion/components'
import { GithubFilled, GoogleFilled, ConnectFilled, ArrowRightOutlined } from '@comunion/icons'
import { computed, defineComponent, onMounted, ref } from 'vue'
import Bookmarks from './components/Bookmarks'
import Bounties from './components/Bounties'
import EditProfile from './components/EditProfile'
import FollowDatel from './components/FollowDatel'
import Proposals from './components/Proposals'
import Startups from './components/Startups'
import { ServiceReturn, services } from '@/services'
// import { useWalletStore } from '@/stores'

const DashboardPage = defineComponent({
  name: 'Dashboard',
  setup() {
    // const walletStore = useWalletStore()
    const myProfile = ref<ServiceReturn<'account@comer-profile-get'>>()
    const getDataList = async () => {
      const { error, data } = await services['account@comer-profile-get']()
      if (!error) {
        myProfile.value = data
      }
    }
    onMounted(() => {
      // const { error, data } = await services['account@comer-profile-get']()
      // if (!error) {
      //   myProfile.value = data
      // }
      getDataList()
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

    const count = ref(0)

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

    const list = {
      id: 102040386875392,
      createdAt: '2022-04-19T07:09:42Z',
      updatedAt: '2022-04-29T09:04:10Z',
      isDeleted: false,
      comerID: 99804655071232,
      name: 'vodak',
      mode: 1,
      logo: '',
      mission: 'tsx',
      tokenContractAddress: '0xDBf39437b7584BD9a7d4c4D0484d070B07773418',
      overview:
        'big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big big ',
      blockChainAddress: '',
      isSet: false,
      kyc: '',
      contractAudit: '',
      hashTags: [
        {
          id: 102040386875394,
          createdAt: '2022-04-19T07:09:42Z',
          updatedAt: '2022-04-19T07:09:42Z',
          isDeleted: false,
          name: 'JavaScipt',
          category: 'startup',
          isIndex: false
        }
      ],
      website: '',
      discord: '',
      twitter: '',
      telegram: '',
      docs: '',
      presaleDate: '2022-04-14T00:00:00Z',
      launchDate: '',
      wallets: [
        {
          id: 105684779872256,
          createdAt: '2022-04-29T08:31:12Z',
          updatedAt: '2022-04-29T09:04:10Z',
          isDeleted: false,
          comerID: 98104439418880,
          startupID: 102040386875392,
          walletName: '',
          walletAddress: ''
        }
      ],
      members: [
        {
          ID: 105006338617344,
          CreatedAt: '2022-04-27T11:35:20Z',
          UpdatedAt: '2022-04-27T13:25:44Z',
          comerID: 99804655071232,
          startupID: 102040386875392,
          position: 'TS-L',
          comer: {
            id: 0,
            createdAt: '0001-01-01T00:00:00Z',
            updatedAt: '0001-01-01T00:00:00Z',
            isDeleted: false,
            Address: null
          },
          comerProfile: {
            id: 0,
            createdAt: '0001-01-01T00:00:00Z',
            updatedAt: '0001-01-01T00:00:00Z',
            isDeleted: false,
            comerID: 0,
            name: '',
            avatar: '',
            location: '',
            website: '',
            bio: '',
            skills: null
          }
        },
        {
          ID: 110396543545344,
          CreatedAt: '2022-05-12T08:34:04Z',
          UpdatedAt: '2022-05-12T08:34:04Z',
          comerID: 86445310291968,
          startupID: 102040386875392,
          position: '123',
          comer: {
            id: 0,
            createdAt: '0001-01-01T00:00:00Z',
            updatedAt: '0001-01-01T00:00:00Z',
            isDeleted: false,
            Address: null
          },
          comerProfile: {
            id: 0,
            createdAt: '0001-01-01T00:00:00Z',
            updatedAt: '0001-01-01T00:00:00Z',
            isDeleted: false,
            comerID: 0,
            name: '',
            avatar: '',
            location: '',
            website: '',
            bio: '',
            skills: null
          }
        }
      ],
      memberCount: 2,
      follows: [],
      followCount: 0
    }

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
                      <div class="mb-2 u-body2">utakata@gmail.com · Shanghai, China ( UTC+8 )</div>
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
                    <div class="flex align-center cursor-pointer">
                      <ConnectFilled />
                      <span class=" pl-2 font-400 text-14px text-primary">
                        http://www.figma.com
                      </span>
                    </div>
                  </div>
                  <div class="mt-5 flex">
                    {socialLinks.map(link => {
                      return (
                        <div class="mr-4">
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
                  <div class="u-headline2 text-32px font-700 text-primary mt-4 ml-4">79</div>
                  <div class="flex align-center ml-4 mt-4 cursor-pointer">
                    {count.value ? (
                      <div class="u-body2  text-primary">Startup</div>
                    ) : (
                      <FollowDatel startup={list} />
                    )}
                    <div class="flex-1"></div>
                    <ArrowRightOutlined class="mt-1 mr-3 w-4 h-4 text-primary" />
                  </div>
                </div>
                <div class="w-40 h-25 rounded-lg bg-blue-50">
                  <div class="u-headline2 text-32px font-700 text-primary mt-4 ml-4">0</div>
                  <div class="flex align-center ml-4 mt-4 cursor-pointer">
                    <div class="u-body2  text-primary">Comer</div>
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
