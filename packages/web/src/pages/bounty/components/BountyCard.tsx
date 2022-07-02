import { UStartupLogo, UTag } from '@comunion/components'
// import { StartupLogoOutlined } from '@comunion/icons'
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
    // const hashtagsArray = props.startup.hashTags.map(key => {
    //   return key.name
    // })
    // const modeName = getStartupTypeFromNumber(props.startup.mode) as StartupTypesType

    // const router = useRouter()

    // const toStartDetail = (startupInfo: StartupItem) => {
    //   router.push({ path: '/startup/detail', query: { startupId: startupInfo.id } })
    // }
    const dataList = [
      {
        label: 'Ready to work',
        color: '#00BFA5'
      },
      {
        label: 'Stage',
        color: '#1C60F3'
      },
      {
        label: 'created 5 hours ago',
        color: '#3F2D99'
      }
    ]

    return () => (
      <div class="flex h-40 w-full items-center cursor-pointer border-b-1">
        <div class="flex h-full w-20 items-center">
          <UStartupLogo
            src={props.startup.logo}
            width="10"
            height="10"
            class="h-20 w-20 rounded-md -mt-12"
          />
        </div>
        <div class="flex-1 flex h-full ml-6 w-full items-center">
          <div class="content">
            <div class="u-title1 mb-2.5 max-w-200 truncate">{props.startup.name}</div>
            <div class="flex items-center flex-row">
              <div class="mb-4 mr-5">
                {dataList.map((tag, i) => {
                  return i + 1 < 4 ? (
                    <UTag
                      class={[i === 0 ? 'p-0' : 'ml-2', `px-2`]}
                      key={i}
                      style={{
                        'border-color': tag.color
                      }}
                    >
                      {tag.label}
                    </UTag>
                  ) : null
                })}
              </div>
              <div class="divide-x mb-4">
                {props.startup.hashTags.map((tag, i) => {
                  return i + 1 < 4 ? (
                    <span class={[i === 0 ? '' : 'pl-2', 'u-body1 text-grey1 pr-2']} key={i}>
                      {tag.name}
                    </span>
                  ) : null
                })}
              </div>
            </div>

            <div class="u-body2 truncate text-grey3">{props.startup.name}</div>
          </div>
        </div>
        <div class="flex h-full  items-center">
          <div class="flex h-full ml-6 w-full items-center">
            <div class="content">
              <div class="flex justify-end">
                <div
                  class="w-32.5 h-12 flex items-center justify-center rounded-md"
                  style={{
                    background:
                      'linear-gradient(to right, rgba(var(--u-warning2-value), 0.8),rgba(var(--u-warning2-value), 1))'
                  }}
                >
                  <span class="pr-1 u-title1 w-11.5 text-white truncate">1000</span>
                  <span class="pl-1 u-title2 text-white">USDC</span>
                </div>
                <div class="w-5"></div>
                <div
                  class="w-32.5 h-12 flex items-center justify-center rounded-md"
                  style={{
                    background:
                      'linear-gradient(to right, rgba(var(--u-primary-value), 0.8),rgba(var(--u-primary-value), 1))'
                  }}
                >
                  <span class="pr-1 u-title1 w-11.5 text-white truncate">1000</span>
                  <span class="pl-1 u-title2 text-white">UVU</span>
                </div>
              </div>
              <div class="flex justify-end mt-10">
                <span class="u-body2 text-grey2">Deposit requirements：</span>
                <span class="u-card-title2 text-warning">20 USDC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})
export default StartupCard
