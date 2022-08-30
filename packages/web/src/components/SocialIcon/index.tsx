import {
  DiscordFilled,
  WebsiteFilled,
  FacebookFilled,
  UnionFilled,
  TelegramFilled,
  TwitterFilled,
  MailFilled,
  MediumFilled
} from '@comunion/icons'
import { defineComponent } from 'vue'

function asyncComponent(type: string, wrapper: string) {
  if (type === 'Website') {
    return <WebsiteFilled class={`${wrapper} text-primary`} />
  } else if (type === 'Discord') {
    return <DiscordFilled class={`${wrapper} text-primary`} />
  } else if (type === 'Facebook') {
    return <FacebookFilled class={`${wrapper} text-primary`} />
  } else if (type === 'Linktree') {
    return <UnionFilled class={`${wrapper} text-primary`} />
  } else if (type === 'Telegram') {
    return <TelegramFilled class={`${wrapper} text-primary`} />
  } else if (type === 'Twitter') {
    return <TwitterFilled class={`${wrapper} text-primary`} />
  } else if (type === 'Email') {
    return <MailFilled class={`${wrapper} text-primary`} />
  } else if (type === 'Medium') {
    return <MediumFilled class={`${wrapper} text-primary`} />
  }
  return
}

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true
    },
    outWrapper: {
      type: String,
      default: () => 'w-12 h-12'
    },
    innerWrapper: {
      type: String,
      default: () => 'w-5 h-5'
    },
    link: {
      type: Boolean,
      default: () => false
    },
    address: {
      type: String,
      default: () => ''
    }
  },
  render() {
    return (
      <div class={`flex bg-purple ${this.outWrapper} justify-center items-center rounded-4px`}>
        {this.link ? (
          <a href={`${this.icon === 'Email' ? 'mailto:' : ''}${this.address}`} target="_blank">
            {asyncComponent(this.icon, this.innerWrapper)}
          </a>
        ) : (
          <>{asyncComponent(this.icon, this.innerWrapper)}</>
        )}
      </div>
    )
  }
})
