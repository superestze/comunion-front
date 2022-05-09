import { ULazyImage, UStartupLogo } from '@comunion/components'
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
            {props.startup!.logo ? (
              <div class="rounded w-20 h-20 border-1 border-primary1 flex">
                <UStartupLogo class="w-8 h-11 m-auto" />
              </div>
            ) : (
              <ULazyImage src={props.startup!.logo} class="rounded h-20 w-20" />
            )}
          </div>
          <div class="content flex flex-col flex-1">
            <div class="title font-orbitron font-normal font-700 text-[24px] leading-8 text-grey1 mb-2">
              {props.startup!.name}
            </div>
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
                  {/*  TODO after recommend interface finished in backend, please replace this by real data */}
                  {Math.floor(Math.random() * 200) + 800}
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
