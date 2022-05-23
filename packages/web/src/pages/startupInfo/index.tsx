import { UButton, UStartupLogo, UTag } from '@comunion/components'
import {
  WebsiteFilled,
  DiscordFilled,
  TelegramFilled,
  TwitterFilled,
  DocsFilled,
  HookFilled,
  PlusOutlined
} from '@comunion/icons'
import dayjs from 'dayjs'
import utcPlugin from 'dayjs/plugin/utc'
import { defineComponent, onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import styles from './style.module.css'
import { getStartupTypeFromNumber, StartupTypesType, STARTUP_TYPES_COLOR_MAP } from '@/constants'
import { services } from '@/services'
import { StartupItem } from '@/types'

dayjs.extend(utcPlugin)

export const StartupInfo = defineComponent({
  name: 'StartupInfo',
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    const startupId = route.query.startupId
    const userIsFollow = ref(false)

    const startup = ref<StartupItem>()
    const hashtagsArray = startup.value?.hashTags.map(key => {
      return key.name
    })
    const modeName = computed(() => {
      console.log('startup.value?.mode', startup.value?.mode)

      return startup.value
        ? (getStartupTypeFromNumber(startup.value?.mode) as StartupTypesType)
        : ''
    })

    const toSocialEnd = (url: string | undefined) => {
      if (url) {
        router.push(url)
      }
    }

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
      const { data } = await services['startup@startup-followed-by-me']({
        startupId
      })
      userIsFollow.value = data!.isFollowed
    }

    const followStartup = async () => {
      await services['startup@startup-follow']({
        startupId
      })
      getUserIsFollow()
    }

    const unfollowStartup = async () => {
      await services['startup@startup-unfollow']({
        startupId
      })
      getUserIsFollow()
    }

    onMounted(() => {
      getStartup()
      getUserIsFollow()
    })
    return () => (
      <div class="bg-white p-10 mb-20">
        <div class="flex items-start gap-10">
          <UStartupLogo
            src={startup.value?.logo || ''}
            width="20"
            height="20"
            class="rounded !object-contain"
          />
          <div class="flex-1">
            <div class="flex justify-between items-center">
              <div class="flex flex-col">
                <div class="flex items-center">
                  <span class="u-h2">{startup.value?.name}</span>
                  {startup.value && startup.value?.mode > 0 && (
                    <UTag
                      class="ml-5"
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
                <div class="flex flex-wrap gap-2 mt-2">
                  {startup.value?.hashTags?.map((hashTag, value) => {
                    return value + 1 < 4 && <UTag key={value}>{hashTag.name}</UTag>
                  })}
                </div>
              </div>
              <div>
                {userIsFollow.value ? (
                  <UButton
                    type="primary"
                    ghost
                    onClick={() => unfollowStartup()}
                    v-slots={{
                      icon: () => {
                        return (
                          <div class="flex items-center w-4.5">
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
                    onClick={() => followStartup()}
                    v-slots={{
                      icon: () => {
                        return (
                          <div class="flex items-center w-4.5">
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
            <p class="h-10 mb-10 mt-14 break-all u-body1 line-clamp-5">{startup.value?.mission}</p>
            <div class="flex items-center gap-4 mt-7">
              <div class={styles.startupSocialItem}>
                <WebsiteFilled
                  class={startup.value?.website ? 'cursor-pointer' : 'cursor-not-allowed'}
                  onClick={
                    startup.value?.website ? () => toSocialEnd(startup.value?.website) : undefined
                  }
                />
              </div>
              <div class={styles.startupSocialItem}>
                <DiscordFilled
                  class={startup.value?.discord ? 'cursor-pointer' : 'cursor-not-allowed'}
                  onClick={
                    startup.value?.discord ? () => toSocialEnd(startup.value?.discord) : undefined
                  }
                />
              </div>
              <div class={styles.startupSocialItem}>
                <TelegramFilled
                  class={startup.value?.telegram ? 'cursor-pointer' : 'cursor-not-allowed'}
                  onClick={
                    startup.value?.telegram ? () => toSocialEnd(startup.value?.telegram) : undefined
                  }
                />
              </div>
              <div class={styles.startupSocialItem}>
                <TwitterFilled
                  class={startup.value?.twitter ? 'cursor-pointer' : 'cursor-not-allowed'}
                  onClick={
                    startup.value?.twitter ? () => toSocialEnd(startup.value?.twitter) : undefined
                  }
                />
              </div>
              <div class={styles.startupSocialItem}>
                <DocsFilled
                  class={startup.value?.docs ? 'cursor-pointer' : 'cursor-not-allowed'}
                  onClick={startup.value?.docs ? () => toSocialEnd(startup.value?.docs) : undefined}
                />
              </div>
              <span class="ml-auto u-body1">
                Create due: {dayjs.utc(startup.value?.createdAt).format('YYYY-MM-DD UTC')}
              </span>
            </div>
          </div>
        </div>
        <div class="w-full h-1px bg-grey5 mt-10"></div>
        <section class="ml-30 mt-10">
          <p class="mb-4.5">
            <span class="u-label2 text-grey3">KYC:</span>
            <span class="u-title2 ml-4">
              {startup.value?.kyc ? <a href={startup.value?.kyc}>{startup.value?.kyc}</a> : '--'}
            </span>
          </p>
          <p class="mb-4.5">
            <span class="u-label2 text-grey3 whitespace-nowrap">CONTRACT AUDIT:</span>
            <span class="u-title2 ml-4">
              {startup.value?.contractAudit ? (
                <a href={startup.value?.contractAudit}>{startup.value?.contractAudit}</a>
              ) : (
                '--'
              )}
            </span>
          </p>
          <p class="mb-4.5">
            <span class="u-label2 text-grey3 whitespace-nowrap">BLOCKCHAIN ADDRESS:</span>
            <span class="u-title2 ml-4">{startup.value?.blockChainAddress || '--'}</span>
          </p>
          <p class="mt-6 u-body1 break-all">{startup.value?.overview}</p>
        </section>
      </div>
    )
  }
})

export default StartupInfo
