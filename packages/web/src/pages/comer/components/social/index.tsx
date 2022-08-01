import { UCard, UPopover } from '@comunion/components'
import {
  DiscordFilled,
  WebsiteFilled,
  FacebookFilled,
  UnionFilled,
  TelegramFilled,
  TwitterFilled,
  MailFilled,
  MediumFilled,
  PenOutlined,
  DeleteFilled
} from '@comunion/icons'
import { defineComponent } from 'vue'

export default defineComponent({
  render() {
    return (
      <UCard title="SOCIAL" class="mb-6">
        <div class="my-6 flex gap-4 cursor-pointer">
          <UPopover
            trigger="click"
            placement="top"
            v-slots={{
              trigger: () => (
                <div class="flex bg-purple w-8 h-8 justify-center items-center rounded-4px">
                  <WebsiteFilled class="w-5 h-5 text-primary" />
                </div>
              ),
              default: () => (
                <div class="flex m-3 cursor-pointer">
                  <PenOutlined class="text-primary w-3.5 h-3.5 mr-4.5" />
                  <DeleteFilled class="text-primary w-3.5 h-3.5" />
                </div>
              )
            }}
          />
          <div class="flex bg-purple w-8 h-8 justify-center items-center rounded-4px">
            <DiscordFilled class="w-5 h-5 text-primary" />
          </div>
          <div class="flex bg-purple w-8 h-8 justify-center items-center rounded-4px">
            <FacebookFilled class="w-5 h-5 text-primary" />
          </div>
          <div class="flex bg-purple w-8 h-8 justify-center items-center rounded-4px">
            <UnionFilled class="w-5 h-5 text-primary" />
          </div>
          <div class="flex bg-purple w-8 h-8 justify-center items-center rounded-4px">
            <TelegramFilled class="w-5 h-5 text-primary" />
          </div>
          <div class="flex bg-purple w-8 h-8 justify-center items-center rounded-4px">
            <TwitterFilled class="w-5 h-5 text-primary" />
          </div>
          <div class="flex bg-purple w-8 h-8 justify-center items-center rounded-4px">
            <MailFilled class="w-5 h-5 text-primary" />
          </div>
          <div class="flex bg-purple w-8 h-8 justify-center items-center rounded-4px">
            <MediumFilled class="w-5 h-5 text-primary" />
          </div>
        </div>
      </UCard>
    )
  }
})
