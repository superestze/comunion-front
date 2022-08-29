import { UTag, UStartupLogo } from '@comunion/components'
// import { StartupLogoOutlined } from '@comunion/icons'
import { defineComponent, PropType } from 'vue'
import { useRouter } from 'vue-router'
import {
  getStartupTypeFromNumber,
  StartupTypesType,
  STARTUP_TYPES_COLOR_MAP,
  STARTUP_TYPES_SUBCOLOR_MAP,
  NETWORKS_COLOR_MAP,
  NETWORKS_SUBCOLOR_MAP
} from '@/constants'
import { StartupItem } from '@/types'
import { getChainInfoByChainId } from '@/utils/etherscan'

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
    const theChainName = getChainInfoByChainId(props.startup.chainID)?.shortName
    const STARTUP_TAG_CLASS =
      'inline-block h-1.25rem leading-5 px-0.5rem text-[#3F2D99] border-1 border-[#3F2D99] rounded-sm'
    const STARTUP_SUB_TAG_CLASS =
      'inline-block ml-1 h-1.25rem leading-5 px-0.5rem text-[#fff] rounded-sm'

    return () => (
      <div
        class="bg-white rounded cursor-pointer h-80 top-0 relative hover:shadow-md hover:-top-0.5rem"
        style="transition:all ease .3s"
        onClick={() => toStartDetail(props.startup)}
      >
        <div class="p-6 ">
          <div class="flex items-center">
            <UStartupLogo
              src={props.startup.logo}
              width="8"
              height="12"
              class="rounded h-3.75rem mr-0.75rem w-3.75rem !object-cover"
            />
            <div class="flex-1 ">
              <div class="mb-0.5rem float-right">
                {props.startup.mode > 0 && (
                  <UTag
                    class="u-body3 !rounded-bl-md !rounded-tr-md !font-bold !text-14px"
                    type="filled"
                    bgColor={STARTUP_TYPES_SUBCOLOR_MAP[modeName]}
                    style={{ color: STARTUP_TYPES_COLOR_MAP[modeName] }}
                  >
                    {modeName}
                  </UTag>
                )}
              </div>
              <div class="float-right clear-right">
                {theChainName && (
                  <div
                    class="rounded flex py-0.25rem px-0.5rem items-center"
                    style={{
                      color: NETWORKS_COLOR_MAP[theChainName.split(' ').join('')],
                      background: NETWORKS_SUBCOLOR_MAP[theChainName.split(' ').join('')]
                    }}
                  >
                    <img
                      src={getChainInfoByChainId(props.startup.chainID)?.logo}
                      class="h-1.25rem mr-0.2rem w-1.25rem"
                    />
                    <span class="text-12px truncate">{theChainName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div class="my-2 truncate u-h3" title={props.startup.name}>
            {props.startup.name}
          </div>
          <p class="h-14 mb-6 break-all u-body1 line-clamp-3">{props.startup.mission}</p>
          <div class="flex flex-wrap text-0.75rem gap-1">
            {hashtagsArray.map((key, value) => {
              return (
                value < 4 && (
                  <span key={value} class={STARTUP_TAG_CLASS}>
                    {key}
                  </span>
                )
              )
            })}

            {hashtagsArray.length - 4 > 0 ? (
              <span class={STARTUP_TAG_CLASS}>+ {hashtagsArray.length - 4}</span>
            ) : null}
          </div>
          {/* 底部 */}
          <div class="right-6 bottom-6 left-6 text-0.75rem absolute">
            <div class="flex items-center">
              <span class="rounded-bl-md rounded-tr-md bg-[#F4F4F4] h-1.625rem px-0.5rem text-[#636366] leading-1.625rem inline-block">
                <em class="font-700 mr-0.2rem">{props.startup.followCount}</em>
                Connections
              </span>
              <div class="flex-1"></div>
              {props.startup.kyc && (
                <span class={STARTUP_SUB_TAG_CLASS + ' bg-[#EC53A4]'}>KYC</span>
              )}
              {props.startup.contractAudit && (
                <span class={STARTUP_SUB_TAG_CLASS + ' bg-[#5331F4]'}>AUDIT</span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
})

export default StartupCard
