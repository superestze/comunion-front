import { UAddress, UButton, UCard, ULazyImage, UScrollbar, UTooltip } from '@comunion/components'
import {
  ConnectOutlined,
  DiscordFilled,
  EmailFilled,
  HookFilled,
  MediumFilled,
  PlusOutlined,
  TelegramFilled,
  WebsiteFilled
} from '@comunion/icons'
import { defineComponent, PropType, computed, h } from 'vue'
import { ServiceReturn } from '@/services'
import { toSocialEnd } from '@/utils/socialJump'

type ProfileInfo = NonNullable<ServiceReturn<'account@comer-info-get'>>['comerProfile']

export const ComerInfo = defineComponent({
  name: 'ComerInfo',
  props: {
    profileInfo: {
      type: Object as PropType<ProfileInfo>
    }
  },
  setup(props) {
    const skills = computed(() => {
      return props.profileInfo?.skills.map((skill, skillIndex) => {
        return (
          <div>
            <span class="u-body2">{skill.name}</span>
            {skillIndex + 1 !== props.profileInfo?.skills.length && (
              <span class="text-grey5 mx-2">|</span>
            )}
          </div>
        )
      })
    })
    const socialLinks = computed(() => [
      {
        key: 'website',
        component: WebsiteFilled,
        value: props.profileInfo?.website
      },
      {
        key: 'discord',
        component: DiscordFilled,
        value: props.profileInfo?.discord
      },
      {
        key: 'telegram',
        component: TelegramFilled,
        value: props.profileInfo?.telegram
      },
      {
        key: 'medium',
        component: MediumFilled,
        value: props.profileInfo?.medium
      },
      {
        key: 'email',
        component: EmailFilled,
        value: props.profileInfo?.email
      }
    ])
    const followToggle = (toStatus: string) => {
      if (toStatus === 'follow') {
        console.log('ddd')
      }
    }
    return {
      skills,
      followToggle,
      socialLinks
    }
  },
  render() {
    return (
      <UCard class="">
        <div class="flex items-center">
          <ULazyImage src={this.profileInfo?.avatar ?? ''} class="h-16 w-16 rounded-1\/2" />
          <div class="flex-1 ml-4">
            <div class="u-h2">{this.profileInfo?.name}</div>
            <UAddress autoSlice={true} address={this.profileInfo?.walletAddress ?? ''} />
          </div>
        </div>
        <div>
          <div class="mt-5 mb-1.5 flex items-center">{this.skills}</div>
          <div class="mb-10">
            <span class="u-body2 text-grey3">{this.profileInfo?.email}</span>
            <span class="u-body2 text-grey3">· {this.profileInfo?.location}</span>
            <span class="u-body2 text-grey3">· {this.profileInfo?.timeZone}</span>
          </div>
        </div>
        <div>
          {this.profileInfo?.id ? (
            <UButton
              type="primary"
              size="small"
              style={{ width: '120px' }}
              ghost
              onClick={() => this.followToggle('follow')}
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
              size="small"
              onClick={() => this.followToggle('unFollow')}
              style={{ width: '120px' }}
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
        <div class="mt-10 mb-3 break-words cursor-pointer max-w-145 max-h-25 leading-5 content break-all line-clamp-5">
          <UTooltip
            showArrow={false}
            overlap={true}
            width={340}
            style={{
              background: 'rgba(var(--u-primary2-value), 0.8)',
              padding: '0'
            }}
          >
            {{
              trigger: () => (
                <div class="u-body2 text-grey1 flex-1 break-all max-h-37">
                  {this.profileInfo?.bio}
                </div>
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
                    {this.profileInfo?.bio}
                  </UScrollbar>
                )
              }
            }}
          </UTooltip>
        </div>
        <div class="mt-6 mb-10">
          {this.profileInfo?.website && (
            <div class="flex align-center cursor-pointer">
              <ConnectOutlined class="text-primary" />
              <a
                href={this.profileInfo?.website}
                target="_blank"
                class="pl-2 font-400 text-14px text-primary"
              >
                {this.profileInfo?.website}
              </a>
            </div>
          )}
        </div>
        <div class="flex gap-2.5 mb-10">
          {this.socialLinks.map(socialLink => (
            <div
              key={socialLink.key}
              class="bg-purple rounded w-10 h-10 flex items-center justify-center"
            >
              <socialLink.component
                onClick={() => (socialLink.value ? toSocialEnd(socialLink.value) : null)}
              />
            </div>
          ))}
        </div>
        <div class="bg-grey5 h-[1px]"></div>
        <div class="flex gap-4 mt-10">
          <div
            class="flex-1 px-4 py-5"
            style={{
              background: 'rgba(var(--u-primary2-value), 0.038)'
            }}
          >
            <div class="u-h2">{}</div>
            <div class="u-body2 text-primary">Fans</div>
          </div>
          <div
            class="flex-1 px-4 py-5"
            style={{
              background: 'rgba(var(--u-primary2-value), 0.038)'
            }}
          >
            <div>{}</div>
            <div>Follow</div>
          </div>
        </div>
      </UCard>
    )
  }
})
