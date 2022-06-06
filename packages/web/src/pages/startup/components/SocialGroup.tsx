import {
  WebsiteFilled,
  WebsiteGreyFilled,
  DiscordFilled,
  DiscordGreyFilled,
  TelegramFilled,
  TelegramGreyFilled,
  TwitterFilled,
  TwitterGreyFilled,
  DocsFilled,
  DocGreyFilled
} from '@comunion/icons'
import { defineComponent } from 'vue'
import styles from './SocialGroup.module.css'
import { toSocialEnd } from '@/utils/socialJump'

export const SocialGroup = defineComponent({
  name: 'socialGroup',
  props: ['website', 'discord', 'telegram', 'twitter', 'docs'],
  setup(props) {
    return () => (
      <div>
        <div class={styles.startupSocialItem}>
          {props.website ? (
            <WebsiteFilled class="cursor-pointer" onClick={() => toSocialEnd(props.website)} />
          ) : (
            <WebsiteGreyFilled class="cursor-not-allowed" />
          )}
        </div>
        <div class={styles.startupSocialItem}>
          {props.discord ? (
            <DiscordFilled class={'cursor-pointer'} onClick={() => toSocialEnd(props.discord)} />
          ) : (
            <DiscordGreyFilled class="cursor-not-allowed" />
          )}
        </div>
        <div class={styles.startupSocialItem}>
          {props.telegram ? (
            <TelegramFilled class="cursor-pointer" onClick={() => toSocialEnd(props.telegram)} />
          ) : (
            <TelegramGreyFilled class="cursor-not-allowed" />
          )}
        </div>
        <div class={styles.startupSocialItem}>
          {props.twitter ? (
            <TwitterFilled class="cursor-pointer" onClick={() => toSocialEnd(props.twitter)} />
          ) : (
            <TwitterGreyFilled class="cursor-not-all" />
          )}
        </div>
        <div class={styles.startupSocialItem}>
          {props.docs ? (
            <DocsFilled class="cursor-pointer" onClick={() => toSocialEnd(props.docs)} />
          ) : (
            <DocGreyFilled class="cursor-not-allowed" />
          )}
        </div>
      </div>
    )
  }
})
