import { UCard, UAddress, ULazyImage, UScrollbar } from '@comunion/components'
import { computed, defineComponent, onMounted, ref } from 'vue'
import Bookmarks from './components/Bookmarks'
import Bounties from './components/Bounties'
import EditProfile from './components/EditProfile'
import Proposals from './components/Proposals'
import SocialLinks from './components/SocialLinks'
import Startups from './components/Startups'
import { ServiceReturn, services } from '@/services'
import { useWalletStore } from '@/stores'

const DashboardPage = defineComponent({
  name: 'Dashboard',
  setup() {
    const walletStore = useWalletStore()
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
    const style = {
      currency: 'u-body2 text-grey1 flex-1 break-all max-h-37 overflow-auto'
    }
    return () => (
      <div>
        <div class="mt-50px text-primary mb-10 u-h2">My Dashboard</div>
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
          <div class="flex">
            <div class="flex flex-col flex-1 mt-7 pr-8">
              <div class="flex">
                <ULazyImage class="rounded-1/2 h-16 w-16" src={myProfile.value?.avatar ?? ''} />
                <div class="flex flex-col ml-5 justify-center">
                  <div class="mb-3 u-title1">{myProfile.value?.name}</div>
                  <div class="flex items-center">
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
                  </div>
                </div>
              </div>
              <div class="mt-2">
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
                      {/* <div class={[i + 1 === 4 ? 'h-148' : '', style.currency]}>{info.value}</div> */}
                    </div>
                  )
                })}
              </div>
            </div>
            <div class="bg-purple rounded-lg flex flex-col p-4 px-6">
              <SocialLinks />
            </div>
          </div>
        </UCard>
        <div class="mt-6 mb-20 grid gap-x-6 gap-y-6 grid-cols-2 grid-rows-2">
          <Startups class="bg-white border-lg border-1 border-grey5 h-155 box-border" />
          <Bounties class="bg-white border-lg border-1 border-grey5 h-155 box-border" />
          <Proposals class="bg-white border-lg border-1 border-grey5 h-155 box-border" />
          <Bookmarks class="bg-white border-lg border-1 border-grey5 h-155 box-border" />
        </div>
      </div>
    )
  }
})

export default DashboardPage
