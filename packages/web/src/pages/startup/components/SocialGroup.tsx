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
    const website = computed(() => props.website)
    const discord = computed(() => props.discord)
    const telegram = computed(() => props.telegram)
    const twitter = computed(() => props.twitter)
    const docs = computed(() => props.docs)
    return () => (
      <div>
        <div class={styles.startupSocialItem}>
          {website.value ? (
            <WebsiteFilled
              class={styles.activeSocialItemIcon}
              onClick={() => toSocialEnd(website.value)}
            />
          ) : (
            <WebsiteFilled class={styles.inactiveSocialItemIcon} />
          )}
        </div>
        <div class={styles.startupSocialItem}>
          {discord.value ? (
            <DiscordFilled
              class={styles.activeSocialItemIcon}
              onClick={() => toSocialEnd(discord.value)}
            />
          ) : (
            <DiscordFilled class={styles.inactiveSocialItemIcon} />
          )}
        </div>
        <div class={styles.startupSocialItem}>
          {telegram.value ? (
            <TelegramFilled
              class={styles.activeSocialItemIcon}
              onClick={() => toSocialEnd(telegram.value)}
            />
          ) : (
            <TelegramFilled class={styles.inactiveSocialItemIcon} />
          )}
        </div>
        <div class={styles.startupSocialItem}>
          {twitter.value ? (
            <TwitterFilled
              class={styles.activeSocialItemIcon}
              onClick={() => toSocialEnd(twitter.value)}
            />
          ) : (
            <TwitterFilled class={styles.inactiveSocialItemIcon} />
          )}
        </div>
        <div class={styles.startupSocialItem}>
          {docs.value ? (
            <DocsFilled
              class={styles.activeSocialItemIcon}
              onClick={() => toSocialEnd(docs.value)}
            />
          ) : (
            <DocsFilled class={styles.inactiveSocialItemIcon} />
          )}
        </div>
      </div>
    )
  }
})
