import { UTag, UStartupLogo } from '@comunion/components'
// import { StartupLogoOutlined } from '@comunion/icons'
import { defineComponent, PropType } from 'vue'
import { useRouter } from 'vue-router'
import { getStartupTypeFromNumber, StartupTypesType } from '@/constants'
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
      router.push({ path: `/startup/${startupInfo.id}` })
    }
    const theChainName = getChainInfoByChainId(props.startup.chainID)?.shortName

    return () => (
      <div
<<<<<<< HEAD
        class="bg-white border border-color-border rounded-sm cursor-pointer h-90 top-0 relative hover:bg-color-hover"
=======
        class="bg-white border border-color-border rounded cursor-pointer h-96 top-0 relative hover:shadow-md hover:-top-0.5rem"
>>>>>>> 9f04e0ec (feat(doc): ✨ add doc/agreement)
        style="transition:all ease .3s"
        onClick={() => toStartDetail(props.startup)}
      >
        <div class="p-6 ">
          <div class="flex items-center">
            <UStartupLogo
              src={props.startup.logo}
              width="8"
              height="12"
              class="bg-white rounded h-3.75rem mr-0.75rem w-3.75rem !object-cover"
            />
            <div class="flex-1 ">
              <div class="mb-0.5rem float-right">
                {props.startup.mode > 0 && (
                  <UTag
                    class="text-color2 !h-6"
                    // type="filled"
                    // bgColor={STARTUP_TYPES_SUBCOLOR_MAP[modeName]}
                    // style={{ color: STARTUP_TYPES_COLOR_MAP[modeName] }}
                  >
                    {modeName}
                  </UTag>
                )}
              </div>
              <div class="float-right clear-right">
                {theChainName && (
                  <div
                    class=" flex py-1 items-center"
                    // style={{
                    //   color: NETWORKS_COLOR_MAP[theChainName.split(' ').join('')],
                    //   background: NETWORKS_SUBCOLOR_MAP[theChainName.split(' ').join('')]
                    // }}
                  >
                    <img
                      src={getChainInfoByChainId(props.startup.chainID)?.logo}
                      class="h-4 mr-1 w-4"
                    />
                    <span class="text-color2 truncate u-h6">{theChainName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div class="mt-12 mb-1 text-color1 truncate u-h3" title={props.startup.name}>
            {props.startup.name}
          </div>
          <p class="mb-2 text-color3 break-all u-h6 line-clamp-3">{props.startup.mission}</p>
          <div class="flex flex-wrap text-0.75rem gap-2">
            {hashtagsArray.map((key, value) => {
              return value < 4 && <UTag key={value}>{key}</UTag>
            })}

            {hashtagsArray.length - 4 > 0 ? <UTag>+ {hashtagsArray.length - 4}</UTag> : null}
          </div>
          {/* footer */}
          <div class="right-6 bottom-6 left-6 text-0.75rem absolute">
            <div class="flex items-center">
              <span class="h-4 px-2 text-color2 inline-block u-h7">
                <strong class="mr-0.2rem text-color3">{props.startup.followCount}</strong>
                Connections
              </span>
              <div class="flex-1"></div>
              {props.startup.kyc && <UTag class="text-color2">KYC</UTag>}
              {props.startup.contractAudit && <UTag class="ml-2 text-color2">AUDIT</UTag>}
            </div>
          </div>
        </div>
      </div>
    )
  }
})

export default StartupCard
