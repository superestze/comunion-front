import { UCard, UAddress } from '@comunion/components'
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
          value: myProfile.value?.skills?.map(skill => skill.name).join(' | ')
        },
        {
          label: 'Bio',
          value: myProfile.value?.bio
        }
      ]
    })
    const slots = {
      'header-extra': () => !!myProfile.value && <EditProfile myProfile={myProfile.value} />
    }

    return () => (
      <div class="dashboard">
        <div class="text-primary font-orbitron text-[40px] font-700 mb-10 not-italic">
          My Dashboard
        </div>
        <div class="dashboardMyProfile">
          <UCard
            title="MY PROFILE"
            size="small"
            class="p-10 font-700 font-4 leading-6 tracking-2px"
            v-slots={slots}
          >
            <div class="flex">
              <div class="flex flex-col flex-1 mt-7">
                <div class="flex">
                  <img class="w-20 h-20 rounded-1/2" src={myProfile.value?.avatar} />
                  <div class="flex flex-col justify-center ml-5">
                    <div class="font-orbitron font-600 text-[20px] leading-6 mb-3">
                      {myProfile.value?.name}
                    </div>
                    <div class="font-opensans font-400 text-[14px] leading-5 text-primary">
                      {walletStore.address && <UAddress address={walletStore.address} />}
                    </div>
                  </div>
                </div>
                <div class="myInfo">
                  {myInfo.value?.map(info => {
                    return (
                      <div class="flex mb-4 mt-4 break-words">
                        <div class="font-opensans font-700 text-[14px] leading-5 tracking-2px capitalize text-grey3 min-w-50">
                          {info.label}
                        </div>
                        <div class="font-opensans font-400 text-[14px] text-grey1 leading-5 max-w-166">
                          {info.value}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div class="flex flex-col w-354px h-376px rounded-8px p-6 bg-purple">
                <SocialLinks />
              </div>
            </div>
          </UCard>
        </div>
        <div class="grid grid-cols-2 grid-rows-2 gap-x-10 gap-y-5 mt-10 mb-20">
          <Startups class="h-155 rounded-8px  border-1 box-border bg-white border-grey5" />
          <Bounties class="h-155 rounded-8px  border-1 box-border bg-white border-grey5" />
          <Proposals class="h-155 rounded-8px  border-1 box-border bg-white border-grey5" />
          <Bookmarks class="h-155 rounded-8px  border-1 box-border bg-white border-grey5" />
        </div>
      </div>
    )
  }
})

export default DashboardPage
