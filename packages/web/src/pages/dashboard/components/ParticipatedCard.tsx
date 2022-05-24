import { UStartupLogo } from '@comunion/components'
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
  setup(props, context) {
    const styles = {
      combinationStyle: 'u-body1 pr-2 tracking-normal font-opensans leading-5'
    }
    return () => (
      <div class="flex h-28 w-full items-center">
        <div class="flex h-full w-22 items-center">
          <UStartupLogo src={props.startup.logo} width="8" height="8" class="h-18 w-18" />
        </div>
        <div class="flex h-full border-b-1 ml-6 w-full items-center">
          <div class="content">
            <div class="u-title1 font-opensans leading-6">{props.startup.name}</div>
            <div class="divide-x">
              {props.startup.hashTags.map((tag, i) => {
                return i + 1 < 4 ? (
                  <span class={[i === 0 ? '' : 'pl-2', styles.combinationStyle]} key={i}>
                    {tag.name}
                  </span>
                ) : null
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
})

export default StartupCard
