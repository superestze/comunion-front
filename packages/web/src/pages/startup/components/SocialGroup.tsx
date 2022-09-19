import {
  WebsiteFilled,
  DiscordFilled,
  TelegramFilled,
  TwitterFilled,
  DocsFilled,
  EmailFilled,
  MediumFilled,
  FacebookFilled
} from '@comunion/icons'
import { defineComponent, computed } from 'vue'
import styles from './SocialGroup.module.css'
import { toSocialEnd } from '@/utils/socialJump'

export const SocialGroup = defineComponent({
  name: 'socialGroup',
  props: ['website', 'discord', 'telegram', 'twitter', 'docs', 'email', 'medium', 'facebook'],
  setup(props) {
    const socialData = computed(() => [
      {
        key: 'website',
        component: WebsiteFilled,
        value: props.website
      },
      {
        key: 'discord',
        component: DiscordFilled,
        value: props.discord
      },
      {
        key: 'telegram',
        component: TelegramFilled,
        value: props.telegram
      },
      {
        key: 'twitter',
        component: TwitterFilled,
        value: props.twitter
      },
      {
        key: 'docs',
        component: DocsFilled,
        value: props.docs
      },
      {
        key: 'email',
        component: EmailFilled,
        value: props.email
      },
      {
        key: 'medium',
        component: MediumFilled,
        value: props.medium
      },
      {
        key: 'facebook',
        component: FacebookFilled,
        value: props.facebook
      }
    ])

    const clickSocialItem = (value: string) => {
      return value ? toSocialEnd(value) : null
    }

    return () => (
      <div>
        {socialData.value.map(socialItemData => {
          return (
            <div key={socialItemData.key} class={styles.startupSocialItem}>
              <socialItemData.component
                class={
                  socialItemData.value ? styles.activeSocialItemIcon : styles.inactiveSocialItemIcon
                }
                onClick={() => clickSocialItem(socialItemData.value)}
              />
            </div>
          )
        })}
      </div>
    )
  }
})
