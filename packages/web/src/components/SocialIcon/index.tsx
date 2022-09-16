import {
  DiscordFilled,
  WebsiteFilled,
  FacebookFilled,
  UnionFilled,
  TelegramFilled,
  TwitterFilled,
  EmailFilled,
  MediumFilled
} from '@comunion/icons'
import { defineComponent } from 'vue'
function asyncComponent(type: string, wrapper: string, disable?: boolean) {
  const textClass = ''
  // if (disable) {
  //   textClass = 'text-color3'
  // }
  if (type === 'Website') {
    return <WebsiteFilled class={`${wrapper} ${textClass}`} />
  } else if (type === 'Discord') {
    return <DiscordFilled class={`${wrapper} ${textClass}`} />
  } else if (type === 'Facebook') {
    return <FacebookFilled class={`${wrapper} ${textClass}`} />
  } else if (type === 'Linktree') {
    return <UnionFilled class={`${wrapper} ${textClass}`} />
  } else if (type === 'Telegram') {
    return <TelegramFilled class={`${wrapper} ${textClass}`} />
  } else if (type === 'Twitter') {
    return <TwitterFilled class={`${wrapper} ${textClass}`} />
  } else if (type === 'Email') {
    return <EmailFilled class={`${wrapper} ${textClass}`} />
  } else if (type === 'Medium') {
    return <MediumFilled class={`${wrapper} ${textClass}`} />
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
    },
    disable: {
      type: Boolean,
      default: () => false
    }
  },
  render() {
    return (
      <div
        class={`flex justify-center items-center rounded-[50%] ${this.outWrapper} ${
          this.disable ? 'cursor-not-allowed text-color3' : 'text-color2 hover:text-color1'
        }`}
      >
        {this.link ? (
          <a
            class={this.innerWrapper}
            href={`${this.icon === 'Email' ? 'mailto:' : ''}${this.address}`}
            target="_blank"
          >
            {asyncComponent(this.icon, this.innerWrapper)}
          </a>
        ) : (
          <>{asyncComponent(this.icon, this.innerWrapper, this.disable)}</>
        )}
      </div>
    )
  }
})
