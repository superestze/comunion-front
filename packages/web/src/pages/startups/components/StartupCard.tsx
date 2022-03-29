import { UTag } from '@comunion/components'
import { defineComponent, PropType } from 'vue'
import styles from './StartupCard.module.css'
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
    return () => (
      <div class="bg-white rounded h-80 min-w-314px">
        <div class={styles.cardBorder}></div>
        <div class="p-6">
          <div class="flex">
            <img src={props.startup.logo} class="h-10 w-10" />
            {props.startup.mode > 0 && (
              <UTag
                class="ml-auto"
                type="filled"
                bgColor={
                  STARTUP_TYPES_COLOR_MAP[
                    getStartupTypeFromNumber(props.startup.mode) as StartupTypesType
                  ]
                }
              >
                {props.startup.mode}
              </UTag>
            )}
          </div>
          <h3 class="my-2 u-h3">{props.startup.name}</h3>
          <p class="h-10 mb-6 u-body1 line-clamp-2">{props.startup.mission}</p>
          <div class="flex flex-wrap gap-2">
            <UTag>Data processing</UTag>
            <UTag>Blockchain</UTag>
            <UTag>Crytocurrency</UTag>
            <UTag>Dao</UTag>
            <UTag>+3</UTag>
          </div>
          {/* <UTeam */}
        </div>
      </div>
    )
  }
})

export default StartupCard
