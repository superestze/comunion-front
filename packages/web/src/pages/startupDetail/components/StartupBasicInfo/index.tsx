import { UButton, ULazyImage, UTag } from '@comunion/components'
import {
  WebsiteFilled,
  DiscordFilled,
  TelegramFilled,
  TwitterFilled,
  DocsFilled,
  ArrowRightOutlined,
  HookFilled
} from '@comunion/icons'
import { defineComponent, PropType } from 'vue'
import { useRouter } from 'vue-router'
import styles from './style.module.css'
import { getStartupTypeFromNumber, StartupTypesType, STARTUP_TYPES_COLOR_MAP } from '@/constants'
import { StartupItem } from '@/types'

export const StartupBasicInfo = defineComponent({
  name: 'StartupBasicInfo',
  props: {
    startup: {
      type: Object as PropType<StartupItem>
    }
  },
  setup(props) {
    const router = useRouter()
    const hashtagsArray = props.startup!.hashTags.map(key => {
      return key.name
    })
    const modeName = getStartupTypeFromNumber(props.startup!.mode) as StartupTypesType
    const toSocialEnd = (url: string) => {
      router.push(url)
    }
    const toStartupInfo = () => {
      router.push({ path: '/startupinfo', query: { startupId: props.startup?.id } })
    }
    return () => (
      <div class="flex gap-10">
        <div class="h-20 w-20">
          <ULazyImage src={props.startup?.logo ?? ''} class="rounded" />
        </div>
        <div class="flex-1">
          <div class="flex justify-between items-center">
            <div class="flex flex-col">
              <div class="flex items-center">
                <span class="u-h2">{props.startup!.name}</span>
                {props.startup!.mode > 0 && (
                  <UTag class="ml-5" type="filled" bgColor={STARTUP_TYPES_COLOR_MAP[modeName]}>
                    {modeName}
                  </UTag>
                )}
              </div>
              <div class="flex flex-wrap gap-2 mt-2">
                {hashtagsArray.slice(0, 4).map((key, value) => {
                  return value + 1 < 4 && <UTag key={value}>{key}</UTag>
                })}

                {hashtagsArray.length - 3 > 1 ? <UTag>+ {hashtagsArray.length - 3}</UTag> : null}
              </div>
            </div>
            <div>
              <UButton
                type="primary"
                ghost
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
            </div>
          </div>
          <p class="h-10 mb-10 mt-14 break-all u-body1 line-clamp-5">{props.startup!.mission}</p>
          <p class="mb-4.5">
            <span class="u-label2 text-grey3">KYC:</span>
            <span class="u-title2">{props.startup!.kyc || '--'}</span>
          </p>
          <p>
            <span class="u-label2 text-grey3 whitespace-nowrap">CONTRACT AUDIT:</span>
            <span class="u-title2">{props.startup!.contractAudit || '--'}</span>
          </p>
          <div class="flex gap-4 mt-7">
            <div class={styles.startupSocialItem}>
              <WebsiteFilled
                class={props.startup!.website ? 'cursor-pointer' : 'cursor-not-allowed'}
                onClick={
                  props.startup!.website ? () => toSocialEnd(props.startup!.website) : undefined
                }
              />
            </div>
            <div class={styles.startupSocialItem}>
              <DiscordFilled
                class={props.startup!.discord ? 'cursor-pointer' : 'cursor-not-allowed'}
                onClick={
                  props.startup!.discord ? () => toSocialEnd(props.startup!.discord) : undefined
                }
              />
            </div>
            <div class={styles.startupSocialItem}>
              <TelegramFilled
                class={props.startup!.telegram ? 'cursor-pointer' : 'cursor-not-allowed'}
                onClick={
                  props.startup!.telegram ? () => toSocialEnd(props.startup!.telegram) : undefined
                }
              />
            </div>
            <div class={styles.startupSocialItem}>
              <TwitterFilled
                class={props.startup!.twitter ? 'cursor-pointer' : 'cursor-not-allowed'}
                onClick={
                  props.startup!.twitter ? () => toSocialEnd(props.startup!.twitter) : undefined
                }
              />
            </div>
            <div class={styles.startupSocialItem}>
              <DocsFilled
                class={props.startup!.docs ? 'cursor-pointer' : 'cursor-not-allowed'}
                onClick={props.startup!.docs ? () => toSocialEnd(props.startup!.docs) : undefined}
              />
            </div>
          </div>
          <div
            class="flex justify-end items-center text-primary cursor-pointer"
            onClick={toStartupInfo}
          >
            <span class="u-title2 mr-4 text-primary">View all</span>
            <ArrowRightOutlined />
          </div>
        </div>
      </div>
    )
  }
})
