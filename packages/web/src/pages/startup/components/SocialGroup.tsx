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
            <WebsiteFilled class="cursor-pointer" onClick={() => toSocialEnd(website.value)} />
          ) : (
            <WebsiteGreyFilled class="cursor-not-allowed" />
          )}
        </div>
        <div class={styles.startupSocialItem}>
          {discord.value ? (
            <DiscordFilled class={'cursor-pointer'} onClick={() => toSocialEnd(discord.value)} />
          ) : (
            <DiscordGreyFilled class="cursor-not-allowed" />
          )}
        </div>
        <div class={styles.startupSocialItem}>
          {telegram.value ? (
            <TelegramFilled class="cursor-pointer" onClick={() => toSocialEnd(telegram.value)} />
          ) : (
            <TelegramGreyFilled class="cursor-not-allowed" />
          )}
        </div>
        <div class={styles.startupSocialItem}>
          {twitter.value ? (
            <TwitterFilled class="cursor-pointer" onClick={() => toSocialEnd(twitter.value)} />
          ) : (
            <TwitterGreyFilled class="cursor-not-all" />
          )}
        </div>
        <div class={styles.startupSocialItem}>
          {docs.value ? (
            <DocsFilled class="cursor-pointer" onClick={() => toSocialEnd(docs.value)} />
          ) : (
            <DocGreyFilled class="cursor-not-allowed" />
          )}
        </div>
      </div>
    )
  }
})
