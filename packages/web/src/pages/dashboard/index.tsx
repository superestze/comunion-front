import { UCard, UAddress, ULazyImage } from '@comunion/components'
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

    return () => (
      <div>
        <div class="text-primary u-h2 mb-6">My Dashboard</div>
        <UCard
          title="MY PROFILE"
          size="small"
          class="p-6 leading-6 tracking-2px"
          v-slots={{
            'header-extra': () => !!myProfile.value && <EditProfile myProfile={myProfile.value} />
          }}
        >
          <div class="flex">
            <div class="flex flex-col flex-1 mt-7 pr-8">
              <div class="flex">
                <ULazyImage class="w-16 h-16 rounded-1/2" src={myProfile.value?.avatar ?? ''} />
                <div class="flex flex-col justify-center ml-5">
                  <div class="u-title1 mb-3">{myProfile.value?.name}</div>
                  <div class="flex items-center">
                    <div class="w-5 h-5 rounded-full bg-grey3 flex items-center justify-center text-white text-sm tracking-tighter">
                      ID
                    </div>
                    {walletStore.address && (
                      <UAddress class="ml-1.5 u-body2 text-primary" address={walletStore.address} />
                    )}
                  </div>
                </div>
              </div>
              <div class="mt-2">
                {myInfo.value?.map(info => {
                  return (
                    <div class="flex mb-3 mt-3 break-words">
                      <div class="u-label2 uppercase text-grey3 w-50">{info.label}</div>
                      <div class="u-body2 text-grey1 flex-1 break-all">{info.value}</div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div class="flex flex-col px-6 p-4 rounded-lg bg-purple">
              <SocialLinks />
            </div>
          </div>
        </UCard>
        <div class="grid grid-cols-2 grid-rows-2 gap-x-6 gap-y-6 mt-6 mb-20">
          <Startups class="h-155 border-lg border-1 box-border bg-white border-grey5" />
          <Bounties class="h-155 border-lg border-1 box-border bg-white border-grey5" />
          <Proposals class="h-155 border-lg border-1 box-border bg-white border-grey5" />
          <Bookmarks class="h-155 border-lg border-1 box-border bg-white border-grey5" />
        </div>
      </div>
    )
  }
})

export default DashboardPage
