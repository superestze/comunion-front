import { UTooltip } from '@comunion/components'
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
import copy from 'copy-to-clipboard'
import { defineComponent, ref } from 'vue'

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
      default: () => 'm-2'
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
  setup(props, ctx) {
    const showTooltipRef = ref<boolean>(false)

    return {
      showTooltipRef
    }
  },
  render() {
    return (
      <div
        class={`${this.outWrapper} ${
          this.disable ? 'cursor-not-allowed text-color3' : 'text-color2 hover:text-color1'
        }`}
      >
        {this.link ? (
          <>
            {this.icon === 'Discord' && (
              <span
                onClick={e => {
                  e.stopPropagation()
                  this.showTooltipRef = copy(this.address)
                }}
                onMouseleave={e => {
                  e.stopPropagation()
                  this.showTooltipRef = false
                }}
              >
                <UTooltip show={this.showTooltipRef}>
                  {{
                    trigger: () => <>{asyncComponent(this.icon, this.innerWrapper)}</>,
                    default: () => 'Copied!'
                  }}
                </UTooltip>
              </span>
            )}
            {this.icon !== 'Discord' && (
              <a href={`${this.icon === 'Email' ? 'mailto:' : ''}${this.address}`} target="_blank">
                {asyncComponent(this.icon, this.innerWrapper)}
              </a>
            )}
          </>
        ) : (
          <>{asyncComponent(this.icon, this.innerWrapper, this.disable)}</>
        )}
      </div>
    )
  }
})
