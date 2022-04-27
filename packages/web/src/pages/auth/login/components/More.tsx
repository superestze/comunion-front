import { UPopupMenu } from '@comunion/components'
import {
  HelpFilled,
  WebsiteFilled,
  DiscordFilled,
  TelegramFilled,
  TwitterFilled,
  DocsFilled,
  MoreOutlined
} from '@comunion/icons'
import { defineComponent, h, ref } from 'vue'
import DropItem from './DropItem'

const MoreNavigationPage = defineComponent({
  name: 'MoreNavigationPage',
  setup() {
    const options = ref([
      // about comunion
      {
        type: 'render',
        // TODO the about openUrl will be changed after PM given
        render: () => {
          return h(
            <DropItem
              openUrl="https://docs.comunion.org/"
              text="About Comunion"
              icon={HelpFilled}
            />,
            {}
          )
        }
      },
      // line
      {
        type: 'render',
        render: () => {
          return h('div', {
            class: 'bg-grey5 h-[1px] w-full mt-4 mb-4'
          })
        }
      },
      // Website
      {
        type: 'render',
        render: () => {
          return h(
            <DropItem openUrl="https://comunion.org" text="Website" icon={WebsiteFilled} />,
            {}
          )
        }
      },
      // Discord
      {
        type: 'render',
        render: () => {
          return h(
            <DropItem
              openUrl="https://discord.gg/9x4Up6aWRj"
              text="Discord"
              icon={DiscordFilled}
            />,
            {}
          )
        }
      },
      // Telegram
      {
        type: 'render',
        render: () => {
          return h(
            <DropItem
              openUrl="https://t.me/ComunionEconomics"
              text="Telegram"
              icon={TelegramFilled}
            />,
            {}
          )
        }
      },
      // Twitter
      {
        type: 'render',
        render: () => {
          return h(
            <DropItem
              openUrl="https://twitter.com/Comunion01"
              text="Twitter"
              icon={TwitterFilled}
            />,
            {}
          )
        }
      },
      // Docs
      {
        type: 'render',
        render: () => {
          return h(
            <DropItem openUrl="https://docs.comunion.org/" text="Docs" icon={DocsFilled} />,
            {}
          )
        }
      }
    ])

    return () => (
      <>
        <section>
          <UPopupMenu trigger="click" options={options.value}>
            <MoreOutlined class="top-9 right-15 absolute cursor-pointer hover:bg-grey5" />
          </UPopupMenu>
        </section>
      </>
    )
  }
})

export default MoreNavigationPage
