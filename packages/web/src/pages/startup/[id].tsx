import {
  UAddress,
  UBreadcrumb,
  UBreadcrumbItem,
  UButton,
  UStartupLogo,
  UTag,
  USpin
} from '@comunion/components'
import { HookFilled, PlusOutlined, ArrowLeftOutlined } from '@comunion/icons'
import dayjs from 'dayjs'
import utcPlugin from 'dayjs/plugin/utc'
import { defineComponent, onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { SocialGroup } from './components/SocialGroup'
import { getStartupTypeFromNumber, StartupTypesType, STARTUP_TYPES_COLOR_MAP } from '@/constants'
import router from '@/router'
import { services } from '@/services'
import { useWalletStore } from '@/stores'
import { StartupItem } from '@/types'
import { toSocialEnd } from '@/utils/socialJump'

dayjs.extend(utcPlugin)

export const StartupInfo = defineComponent({
  name: 'StartupInfo',
  setup(props) {
    const walletStore = useWalletStore()
    const route = useRoute()
    const startupId = route.params.id
    const userIsFollow = ref(false)
    const pageLoading = ref(false)

    const startup = ref<StartupItem>()
    const modeName = computed(() => {
      console.log('startup.value?.mode', startup.value?.mode)

      return startup.value
        ? (getStartupTypeFromNumber(startup.value?.mode) as StartupTypesType)
        : ''
    })

    const getStartup = async () => {
      if (startupId) {
        const { error, data } = await services['startup@startup-get']({
          startupId
        })
        if (!error) {
          startup.value = data
        }
      }
    }

    const getUserIsFollow = async () => {
      const { error, data } = await services['startup@startup-followed-by-me']({
        startupId
      })
      if (!error) {
        userIsFollow.value = data!.isFollowed
      }
    }

    const toggleFollowStartup = async (type: 'follow' | 'unfollow') => {
      pageLoading.value = true
      const { error } = await services[
        type === 'follow' ? 'startup@startup-follow' : 'startup@startup-unfollow'
      ]({
        startupId
      })
      if (!error) {
        await getUserIsFollow()
      }
      pageLoading.value = false
    }

    onMounted(() => {
      getStartup()
      getUserIsFollow()
    })
    return () => (
      <USpin show={pageLoading.value}>
        <UBreadcrumb class="mt-10 mb-10">
          <UBreadcrumbItem v-slots={{ separator: () => <ArrowLeftOutlined /> }} />
          <UBreadcrumbItem v-slots={{ separator: () => <ArrowLeftOutlined /> }}>
            <span
              class="cursor-pointer text-primary uppercase u-label2"
              onClick={() => {
                router.replace(`/startup/detail?startupId=${startupId}`)
              }}
            >
              STARTUP DETAIL
            </span>
          </UBreadcrumbItem>
          <UBreadcrumbItem v-slots={{ separator: () => <ArrowLeftOutlined /> }}>
            <span class="cursor-pointer text-primary uppercase u-label2">Info</span>
          </UBreadcrumbItem>
        </UBreadcrumb>
        <div class="bg-white mb-20 p-10">
          <div class="flex gap-10 items-start">
            <div class="h-20 w-20">
              <UStartupLogo
                src={startup.value?.logo || ''}
                width="20"
                height="20"
                class="rounded !object-contain"
              />
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-center">
                <div class="flex flex-col mb-2">
                  <div class="flex items-center">
                    <span class="u-h2">{startup.value?.name}</span>
                    {startup.value && startup.value?.mode > 0 && (
                      <UTag
                        class="ml-5 !u-body3-pure"
                        type="filled"
                        bgColor={
                          modeName.value
                            ? STARTUP_TYPES_COLOR_MAP[modeName.value || 'COM']
                            : undefined
                        }
                      >
                        {modeName.value}
                      </UTag>
                    )}
                  </div>
                  <div
                    class={`flex flex-wrap mt-2 gap-2 ${startup.value?.hashTags.length && 'mb-14'}`}
                  >
                    {startup.value?.hashTags?.map((hashTag, value) => {
                      return <UTag key={value}>{hashTag.name}</UTag>
                    })}
                  </div>
                </div>
                <div>
                  {userIsFollow.value ? (
                    <UButton
                      type="primary"
                      ghost
                      onClick={() => toggleFollowStartup('unfollow')}
                      v-slots={{
                        icon: () => {
                          return (
                            <div class="flex w-4.5 items-center">
                              <HookFilled />
                            </div>
                          )
                        }
                      }}
                    >
                      Unfollow
                    </UButton>
                  ) : (
                    <UButton
                      type="primary"
                      onClick={() => toggleFollowStartup('follow')}
                      v-slots={{
                        icon: () => {
                          return (
                            <div class="flex w-4.5 items-center">
                              <PlusOutlined />
                            </div>
                          )
                        }
                      }}
                    >
                      Follow
                    </UButton>
                  )}
                </div>
              </div>
              <p class="h-10 mb-10 break-all u-body1 line-clamp-5">{startup.value?.mission}</p>
              <div class="flex mt-7 gap-4 items-center">
                <SocialGroup
                  discord={startup.value?.discord}
                  website={startup.value?.website}
                  telegram={startup.value?.telegram}
                  twitter={startup.value?.twitter}
                  docs={startup.value?.docs}
                  class="flex gap-4"
                />
                <span class="ml-auto u-body1">
                  Create date: {dayjs.utc(startup.value?.createdAt).format('YYYY-MM-DD UTC')}
                </span>
              </div>
            </div>
          </div>
          <div class="bg-grey5 h-1px mt-10 w-full"></div>
          <section class="mt-10 ml-30">
            <p class="mb-4.5">
              <span class="text-grey3 u-label2">KYC:</span>
              <span class="ml-4 u-title2">
                {startup.value?.kyc ? (
                  <a
                    href="javascript:void(0)"
                    onClick={() => toSocialEnd(startup.value!.kyc)}
                    class="text-primary u-title2"
                  >
                    {startup.value?.kyc}
                  </a>
                ) : (
                  '--'
                )}
              </span>
            </p>
            <p class="mb-4.5">
              <span class="text-grey3 whitespace-nowrap u-label2">CONTRACT AUDIT:</span>
              <span class="ml-4 u-title2">
                {startup.value?.contractAudit ? (
                  <a
                    href="javascript:void(0)"
                    onClick={() => toSocialEnd(startup.value!.contractAudit)}
                    class="text-primary u-title2"
                  >
                    {startup.value?.contractAudit}
                  </a>
                ) : (
                  '--'
                )}
              </span>
            </p>
            <p class="flex mb-4.5 items-center">
              <span class="mr-4 text-grey3 whitespace-nowrap u-label2">BLOCKCHAIN ADDRESS:</span>
              {startup.value?.blockChainAddress ? (
                <UAddress
                  address={startup.value?.blockChainAddress}
                  class="u-title2"
                  blockchainExplorerUrl={walletStore.blockchainExplorerUrl}
                />
              ) : (
                <span class="u-title2">--</span>
              )}
            </p>
            <p class="mt-6 break-all u-body1">{startup.value?.overview}</p>
          </section>
        </div>
      </USpin>
    )
  }
})

export default StartupInfo
