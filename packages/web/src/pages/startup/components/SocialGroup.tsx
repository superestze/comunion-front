import {
  WebsiteFilled,
  DiscordFilled,
  TelegramFilled,
  TwitterFilled,
  DocsFilled
} from '@comunion/icons'
import { defineComponent, computed } from 'vue'
import styles from './SocialGroup.module.css'
import { toSocialEnd } from '@/utils/socialJump'

export const SocialGroup = defineComponent({
  name: 'socialGroup',
  props: ['website', 'discord', 'telegram', 'twitter', 'docs'],
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
