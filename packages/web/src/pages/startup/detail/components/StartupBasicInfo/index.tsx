import { UButton, UStartupLogo, UTag } from '@comunion/components'
import {
  WebsiteFilled,
  DiscordFilled,
  TelegramFilled,
  TwitterFilled,
  DocsFilled,
  ArrowRightOutlined,
  HookFilled,
  PlusOutlined
} from '@comunion/icons'
import { computed, defineComponent, PropType } from 'vue'
import { useRouter } from 'vue-router'
import styles from './style.module.css'
import { getStartupTypeFromNumber, StartupTypesType, STARTUP_TYPES_COLOR_MAP } from '@/constants'
import { StartupItem } from '@/types'
import { toSocialEnd } from '@/utils/socialJump'

export const StartupBasicInfo = defineComponent({
  name: 'StartupBasicInfo',
  emits: ['followStartup', 'unfollowStartup'],
  props: {
    startup: {
      type: Object as PropType<StartupItem>,
      required: true
    },
    userIsFollow: {
      type: Boolean
    }
  },
  setup(props, ctx) {
    const router = useRouter()
    const hashtagsArray = computed(() =>
      props.startup!.hashTags.map(key => {
        return key.name
      })
    )
    const modeName = computed(
      () => getStartupTypeFromNumber(props.startup!.mode) as StartupTypesType
    )
    const toStartupInfo = () => {
      router.push({ path: `/startup/${props.startup?.id}` })
    }
    return () => (
      <div class="flex items-start gap-10">
        <div class="max-w-20 max-h-20">
          <UStartupLogo
            src={props.startup?.logo || ''}
            width="20"
            height="20"
            class="rounded !object-contain"
          />
        </div>
        <div class="flex-1">
          <div class="flex justify-between items-center">
            <div class="flex flex-col">
              <div class="flex items-center">
                <span class="u-h2">{props.startup!.name}</span>
                {props.startup!.mode > 0 && (
                  <UTag
                    class="ml-5 u-body3"
                    type="filled"
                    bgColor={STARTUP_TYPES_COLOR_MAP[modeName.value]}
                  >
                    {modeName.value}
                  </UTag>
                )}
              </div>
              <div class="flex flex-wrap gap-2 mt-2">
                {hashtagsArray.value.slice(0, 4).map((key, value) => {
                  return value + 1 < 4 && <UTag key={value}>{key}</UTag>
                })}

                {hashtagsArray.value.length - 3 > 1 ? (
                  <UTag>+ {hashtagsArray.value.length - 3}</UTag>
                ) : null}
              </div>
            </div>
            <div>
              {props.userIsFollow ? (
                <UButton
                  type="primary"
                  ghost
                  onClick={() => ctx.emit('unfollowStartup')}
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
                  onClick={() => ctx.emit('followStartup')}
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
          <p class="h-10 mb-10 mt-14 break-all u-body1 line-clamp-5">{props.startup!.mission}</p>
          <p class="mb-4.5">
            <span class="u-label2 text-grey3 mr-4">KYC:</span>
            {props.startup!.kyc ? (
              <a
                href="javascript:void(0)"
                onClick={() => toSocialEnd(props.startup!.kyc)}
                class="u-title2 text-primary"
              >
                {props.startup!.kyc}
              </a>
            ) : (
              '--'
            )}
          </p>
          <p>
            <span class="u-label2 text-grey3 whitespace-nowrap mr-4">CONTRACT AUDIT:</span>
            {props.startup!.contractAudit ? (
              <a
                href="javascript:void(0)"
                onClick={() => toSocialEnd(props.startup!.contractAudit)}
                class="u-title2 text-primary"
              >
                {props.startup!.contractAudit}
              </a>
            ) : (
              '--'
            )}
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
