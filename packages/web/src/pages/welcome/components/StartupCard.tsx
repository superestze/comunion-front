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
        <div class="flex flex-row h-45 pt-6 pb-6 border-b border-grey5">
          <div class="logo mr-4">
            <UStartupLogo
              src={props.startup!.logo}
              width="10"
              height="10"
              class="w-20 h-20 rounded"
            />
          </div>
          <div class="content flex flex-col flex-1">
            <div class="u-h3 text-grey1 mb-2">{props.startup!.name}</div>
            <div
              class="line-clamp-2 text-ellipsis content font-opensans font-normal font-400 text-[16px] leading-5 text-grey2 max-w-180 max-h-10 break-all cursor-pointer"
              title={props.startup!.mission}
            >
              {props.startup!.mission}
            </div>
            <div class="foot flex justify-between mt-7">
              <div class="p-1 font-opensans font-normal font-400 text-[12px] leading-3  border border-fuchsia-400 rounded  ">
                {/*{startup?.hashTags.slice(0, 5).map(t => t.name)}*/}
                Data processing
              </div>
              <div class="flex items-center ">
                <TeamOutlined class="h-6 mr-2 w-6 bg-blue-100 text-primary rounded-1/2" />
                <span class="font-opensans italic font-700 text-[16px] leading-5 text-grey1 mr-2">
                  {props.startup!.memberCount}
                </span>
                <span class="font-opensans font-normal font-400 text-[14px] leading-5 text-grey1">
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
