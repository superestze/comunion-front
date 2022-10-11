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
import { validateDiscordUsername } from '@/utils/type'

function asyncComponent(type: string, wrapper: string) {
  if (type === 'Website') {
    return <WebsiteFilled class={`${wrapper}`} />
  } else if (type === 'Discord') {
    return <DiscordFilled class={`${wrapper}`} />
  } else if (type === 'Facebook') {
    return <FacebookFilled class={`${wrapper}`} />
  } else if (type === 'Linktree') {
    return <UnionFilled class={`${wrapper}`} />
  } else if (type === 'Telegram') {
    return <TelegramFilled class={`${wrapper}`} />
  } else if (type === 'Twitter') {
    return <TwitterFilled class={`${wrapper}`} />
  } else if (type === 'Email') {
    return <EmailFilled class={`${wrapper}`} />
  } else if (type === 'Medium') {
    return <MediumFilled class={`${wrapper}`} />
  }
  return null
}

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true
    },
    iconClass: {
      type: String,
      default: () => 'w-5 h-5'
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
  setup() {
    const showTooltipRef = ref<boolean>(false)

    return {
      showTooltipRef
    }
  },
  render() {
    return (
      <div class={`${this.disable ? 'text-[rgba(0,0,0,0.1)]' : 'text-color2 hover:text-color1'}`}>
        {this.address ? (
          <>
            {this.icon === 'Discord' && !!validateDiscordUsername(this.address) ? (
              <span
                title={this.address}
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
                    trigger: () => (
                      <span class="cursor-pointer" title={this.icon}>
                        {asyncComponent(this.icon, this.iconClass)}
                      </span>
                    ),
                    default: () => 'Copied!'
                  }}
                </UTooltip>
              </span>
            ) : (
              <a
                href={`${this.icon === 'Email' ? 'mailto:' : ''}${this.address}`}
                title={this.address}
                target="_blank"
              >
                {asyncComponent(this.icon, this.iconClass)}
              </a>
            )}
          </>
        ) : (
          <span title={this.icon}>{asyncComponent(this.icon, this.iconClass)}</span>
        )}
      </div>
    )
  }
})
