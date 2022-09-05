import { UStartupLogo } from '@comunion/components'
import { BasicSettingFilled } from '@comunion/icons'
import { defineComponent, PropType } from 'vue'
import { useRouter } from 'vue-router'
import { StartupItem } from '@/types'

const StartupCard = defineComponent({
  name: 'StartupCard',
  props: {
    startup: {
      type: Object as PropType<StartupItem>,
      required: true
    },
    view: {
      type: Boolean,
      default: () => false
    }
  },
  setup(props, context) {
    const router = useRouter()

    const basicSetting = (e: Event) => {
      e.stopPropagation()
      router.push({ path: `/startup/setting/${props.startup.id}` })
    }

    const toStartDetail = () => {
      router.push({ path: '/startup/detail', query: { startupId: props.startup.id } })
    }
    return () => (
      <div class="cursor-pointer flex h-28 w-full items-center" onClick={toStartDetail}>
        <div class="flex h-full w-22 items-center">
          <UStartupLogo src={props.startup.logo} width="8" height="8" class="h-18 w-18" />
        </div>
        <div class="flex h-full border-b-1 ml-6 w-full items-center">
          <div class="content">
            <div class="mb-2 u-title1">{props.startup.name}</div>
            <div class="divide-x">
              {props.startup.hashTags.map((tag, i) => {
                return i + 1 < 4 ? (
                  <span class={[i === 0 ? '' : 'pl-2', 'u-body1 pr-2 ']} key={i}>
                    {tag.name}
                  </span>
                ) : null
              })}
            </div>
          </div>
          <div class="ml-auto mr-1 justify-end">
            {props.view ? null : (
              <>
                <BasicSettingFilled
                  class="cursor-pointer rounded-2 h-12 mr-3 w-12"
                  onClick={basicSetting}
                />
              </>
            )}
          </div>
        </div>
      </div>
    )
  }
})

export default StartupCard
