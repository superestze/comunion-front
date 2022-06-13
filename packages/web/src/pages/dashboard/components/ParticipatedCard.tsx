import { UStartupLogo } from '@comunion/components'
import { defineComponent, PropType } from 'vue'
import { useRouter } from 'vue-router'
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
    const router = useRouter()
    const toStartDetail = () => {
      router.push({ path: '/startup/detail', query: { startupId: props.startup.id } })
    }
    return () => (
      <div class="flex h-28 w-full items-center cursor-pointer" onClick={toStartDetail}>
        <div class="flex h-full w-22 items-center">
          <UStartupLogo src={props.startup.logo} width="8" height="8" class="h-18 w-18" />
        </div>
        <div class="flex h-full border-b-1 ml-6 w-full items-center">
          <div class="content">
            <div class="u-title1 mb-2">{props.startup.name}</div>
            <div class="divide-x">
              {props.startup.hashTags.map((tag, i) => {
                return i + 1 < 4 ? (
                  <span class={[i === 0 ? '' : 'pl-2', 'u-body1 pr-2']} key={i}>
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
