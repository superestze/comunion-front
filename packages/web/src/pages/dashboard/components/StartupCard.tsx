import { UStartupLogo } from '@comunion/components'
import { SettingOutlined } from '@comunion/icons'
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
      router.push({ path: `/startup/${props.startup.id}` })
    }

    return () => (
      <div
        class="rounded cursor-pointer flex h-22 mb-4 px-4 pt-4 hover:bg-[#F5F6FA]"
        onClick={toStartDetail}
      >
        <UStartupLogo
          src={props.startup.logo}
          width="8"
          height="8"
          class="rounded-md h-15 mr-3 w-15"
        />
        <div class="flex h-full border-b-1 flex-1">
          <div class="flex-1">
            <div class="mb-2 u-title3">{props.startup.name}</div>
            <div class="flex items-center">
              {props.startup.hashTags.map((tag, i) => {
                return i + 1 < 4 ? (
                  <>
                    {i !== 0 && <p class="bg-grey5 h-3 mx-1 w-1px"></p>}
                    <span class="u-tag" key={i}>
                      {tag.name}
                    </span>
                  </>
                ) : null
              })}
            </div>
          </div>
          {props.view ? null : (
            <>
              <SettingOutlined
                class="cursor-pointer rounded-2 h-6 mt-2 text-primary w-6"
                onClick={basicSetting}
              />
            </>
          )}
        </div>
      </div>
    )
  }
})

export default StartupCard
