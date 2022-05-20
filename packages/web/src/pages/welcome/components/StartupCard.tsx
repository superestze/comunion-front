import { UStartupLogo } from '@comunion/components'
import { TeamOutlined } from '@comunion/icons'
import { defineComponent, PropType } from 'vue'
import { StartupItem } from '@/types'

const StartupCard = defineComponent({
  name: 'StartupCard',
  props: {
    startup: {
      type: Object as PropType<StartupItem>,
      required: true
    }
  },
  setup(props, ctx) {
    return () => (
      <>
        <div class="border-b flex flex-row border-grey5 h-45 pt-6 pb-6">
          <div class="mr-4 logo">
            <UStartupLogo
              src={props.startup!.logo}
              width="10"
              height="10"
              class="rounded h-20 w-20 !object-contain"
            />
          </div>
          <div class="flex flex-col flex-1 content h-35">
            <div class="mb-2 text-grey1 u-h3">{props.startup!.name}</div>
            <div
              class="cursor-pointer font-opensans font-normal font-400 text-ellipsis max-w-180 max-h-10 text-[16px] text-grey2 leading-5 content break-all line-clamp-2"
              title={props.startup!.mission}
            >
              {props.startup!.mission}
            </div>
            <div class="flex mt-7 gap-x-2">
              {props.startup?.hashTags.slice(0, 5).map(t => (
                <div
                  key={t.id}
                  class="rounded p-1px"
                  style={{
                    background: `radial-gradient(circle, #250283 0%, #5F1193 50%, #B46AF9 100%)`
                  }}
                >
                  <div class="bg-white rounded p-1 u-tag">{t.name}</div>
                </div>
              ))}
              <div class="flex ml-auto items-center">
                <TeamOutlined class="bg-blue-100 rounded-1/2 h-6 mr-2 text-primary w-6" />
                <span class="font-opensans font-700 mr-2 text-[16px] text-grey1 leading-5 italic">
                  {props.startup!.memberCount}
                </span>
                <span class="font-opensans font-normal font-400 text-[14px] text-grey1 leading-5">
                  Members
                </span>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
})

export default StartupCard
