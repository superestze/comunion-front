import { UTag, ULazyImage } from '@comunion/components'
import { defineComponent, PropType } from 'vue'
import styles from './StartupCard.module.css'
import UTeamMembers from './TeamMembers'
import { getStartupTypeFromNumber, StartupTypesType, STARTUP_TYPES_COLOR_MAP } from '@/constants'
import { StartupItem } from '@/types'

const StartupCard = defineComponent({
  name: 'StartupCard',
  props: {
    startup: {
      type: Object as PropType<StartupItem>
    }
  },
  setup(props, ctx) {
    /**
     * 从props获取参数hashtags,进行重组（['javaScript','web']）
     */
    const hashtagsArray = props.startup.hashTags.map(key => {
      return key.name
    })
    const modeName = getStartupTypeFromNumber(props.startup.mode) as StartupTypesType
    return () => (
      <div class="bg-white rounded h-80 relative">
        <div class={styles.cardBorder}></div>
        <div class="p-6">
          <div class="flex">
            <ULazyImage src={props.startup.logo} class="rounded h-10 w-10" />
            {props.startup.mode > 0 && (
              <UTag class="ml-auto" type="filled" bgColor={STARTUP_TYPES_COLOR_MAP[modeName]}>
                {modeName}
              </UTag>
            )}
          </div>
          <h3 class="my-2 u-h3">{props.startup.name}</h3>
          <p class="h-10 mb-6 u-body1 line-clamp-2">{props.startup.mission}</p>
          <div class="flex flex-wrap gap-2">
            {hashtagsArray.map((key, value) => {
              return value + 1 < 4 ? <UTag key={value}>{key}</UTag> : <UTag key={value}>+1</UTag>
            })}
          </div>
          {/* <UTeam */}
          <UTeamMembers />
        </div>
      </div>
    )
  }
})

export default StartupCard
