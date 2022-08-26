import { UTag, UStartupLogo } from '@comunion/components'
// import { StartupLogoOutlined } from '@comunion/icons'
import { defineComponent, PropType } from 'vue'
import { useRouter } from 'vue-router'
import {
  getStartupTypeFromNumber,
  StartupTypesType,
  STARTUP_TYPES_COLOR_MAP,
  STARTUP_TYPES_SUBCOLOR_MAP,
  Networks_COLOR_MAP,
  Networks_SUBCOLOR_MAP
} from '@/constants'
import { getChainInfoByChainId } from '@/pages/crowdfunding/utils'
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
    const hashtagsArray = props.startup.hashTags.map(key => {
      return key.name
    })
    const modeName = getStartupTypeFromNumber(props.startup.mode) as StartupTypesType

    const router = useRouter()

    const toStartDetail = (startupInfo: StartupItem) => {
      router.push({ path: '/startup/detail', query: { startupId: startupInfo.id } })
    }
    // 提取几个复用变量
    const ChainName = getChainInfoByChainId(props.startup.chainID)?.shortName
    const StartupTagClass =
      'inline-block h-1.25rem leading-5 px-0.5rem text-[#3F2D99] border-1 border-[#3F2D99] rounded-sm'
    const StartupSubTagClass =
      'inline-block ml-1 h-1.25rem leading-5 px-0.5rem text-[#fff] rounded-sm'

    return () => (
      <div
        class="bg-white rounded h-80 relative cursor-pointer"
        onClick={() => toStartDetail(props.startup)}
      >
        <div class="p-6 ">
          <div class="flex items-center">
            <UStartupLogo
              src={props.startup.logo}
              width="8"
              height="12"
              class="rounded h-3.75rem w-3.75rem !object-cover mr-0.75rem"
            />
            <div class="flex-1 ">
              <div class="float-right mb-0.5rem">
                {props.startup.mode > 0 && (
                  <UTag
                    class="u-body3 !text-14px !font-bold !rounded-bl-md !rounded-tr-md"
                    type="filled"
                    bgColor={STARTUP_TYPES_SUBCOLOR_MAP[modeName]}
                    style={{ color: STARTUP_TYPES_COLOR_MAP[modeName] }}
                  >
                    {modeName}
                  </UTag>
                )}
              </div>
              <div class="float-right clear-right">
                {ChainName && (
                  <div
                    class="flex items-center py-0.25rem px-0.5rem rounded"
                    style={{
                      color: Networks_COLOR_MAP[ChainName.split(' ').join('')],
                      background: Networks_SUBCOLOR_MAP[ChainName.split(' ').join('')]
                    }}
                  >
                    <img
                      src={getChainInfoByChainId(props.startup.chainID)?.logo}
                      class="w-1.25rem h-1.25rem mr-0.2rem"
                    />
                    <span class="text-12px truncate">{ChainName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div class="my-2 truncate u-h3" title={props.startup.name}>
            {props.startup.name}
          </div>
          <p class="h-14 mb-6 break-all u-body1 line-clamp-3">{props.startup.mission}</p>
          <div class="flex flex-wrap gap-1 text-0.75rem">
            {hashtagsArray.map((key, value) => {
              return (
                value < 4 && (
                  <span key={value} class={StartupTagClass}>
                    {key}
                  </span>
                )
              )
            })}

            {hashtagsArray.length - 4 > 0 ? (
              <span class={StartupTagClass}>+ {hashtagsArray.length - 4}</span>
            ) : null}
          </div>
          {/* 底部 */}
          <div class="absolute bottom-6 left-6 right-6 text-0.75rem">
            <div class="flex items-center">
              <span class="inline-block text-[#636366] bg-[#F4F4F4] h-1.625rem leading-1.625rem px-0.5rem rounded-bl-md rounded-tr-md">
                <em class="font-700 mr-0.2rem">{props.startup.followCount}</em>
                Connections
              </span>
              <div class="flex-1"></div>
              {props.startup.kyc && <span class={StartupSubTagClass + ' bg-[#EC53A4]'}>KYC</span>}
              {props.startup.contractAudit && (
                <span class={StartupSubTagClass + ' bg-[#5331F4]'}>AUDIT</span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
})

export default StartupCard
