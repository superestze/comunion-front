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

function asyncComponent(type: string) {
  if (type === 'Website') {
    return <WebsiteFilled class="w-5 h-5 text-primary" />
  } else if (type === 'Discord') {
    return <DiscordFilled class="w-5 h-5 text-primary" />
  } else if (type === 'Facebook') {
    return <FacebookFilled class="w-5 h-5 text-primary" />
  } else if (type === 'Linktree') {
    return <UnionFilled class="w-5 h-5 text-primary" />
  } else if (type === 'Telegram') {
    return <TelegramFilled class="w-5 h-5 text-primary" />
  } else if (type === 'Twitter') {
    return <TwitterFilled class="w-5 h-5 text-primary" />
  } else if (type === 'Email') {
    return <MailFilled class="w-5 h-5 text-primary" />
  } else if (type === 'Medium') {
    return <MediumFilled class="w-5 h-5 text-primary" />
  }
  return
}

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true
    }
  },
  render() {
    return (
      <div class="flex bg-purple w-12 h-12 justify-center items-center rounded-4px">
        {asyncComponent(this.icon)}
      </div>
    )
  }
})
