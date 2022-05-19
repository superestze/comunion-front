import { UButton, ULazyImage, UTag } from '@comunion/components'
import {
  WebsiteFilled,
  DiscordFilled,
  TelegramFilled,
  TwitterFilled,
  DocsFilled
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
    return () => (
      <div class="flex gap-10">
        <div>
          <ULazyImage src={props.startup!.logo} class="h-20 w-20 rounded" />
        </div>
        <div class="flex-1">
          <div class="flex justify-between items-center">
            <div class="flex items-center">
              <span class="u-h2">{props.startup!.name}</span>
              {props.startup!.mode > 0 && (
                <UTag class="ml-5" type="filled" bgColor={STARTUP_TYPES_COLOR_MAP[modeName]}>
                  {modeName}
                </UTag>
              )}
              <div class="flex flex-wrap gap-2">
                {hashtagsArray.slice(0, 4).map((key, value) => {
                  return value + 1 < 4 && <UTag key={value}>{key}</UTag>
                })}

                {hashtagsArray.length - 3 > 1 ? <UTag>+ {hashtagsArray.length - 3}</UTag> : null}
              </div>
            </div>
            <div>
              <UButton type="primary" ghost>
                {Math.random() > 0.5 ? 'Follow' : 'Unfollow'}
              </UButton>
            </div>
          </div>
          <p class="h-10 mb-10 mt-14 break-all u-body1 line-clamp-5">{props.startup!.mission}</p>
          <p class="mb-4.5">
            <span class="u-label2">KYC:</span>
            <span class="u-title2">{props.startup!.kyc}</span>
          </p>
          <p>
            <span class="u-label2">CONTRACT AUDIT:</span>
            <span class="u-title2">{props.startup!.contractAudit}</span>
          </p>
          <div class="flex gap-4 mt-7">
            <div class={styles.startupSocialItem}>
              <WebsiteFilled
                onClick={
                  props.startup!.website ? () => toSocialEnd(props.startup!.website) : undefined
                }
              />
            </div>
            <div class={styles.startupSocialItem}>
              <DiscordFilled
                onClick={
                  props.startup!.website ? () => toSocialEnd(props.startup!.discord) : undefined
                }
              />
            </div>
            <div class={styles.startupSocialItem}>
              <TelegramFilled
                onClick={
                  props.startup!.website ? () => toSocialEnd(props.startup!.telegram) : undefined
                }
              />
            </div>
            <div class={styles.startupSocialItem}>
              <TwitterFilled
                onClick={
                  props.startup!.website ? () => toSocialEnd(props.startup!.twitter) : undefined
                }
              />
            </div>
            <div class={styles.startupSocialItem}>
              <DocsFilled
                onClick={
                  props.startup!.website ? () => toSocialEnd(props.startup!.docs) : undefined
                }
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
})
