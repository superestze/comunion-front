import { UTag } from '@comunion/components'
import { SettingOutlined } from '@comunion/icons'
import { defineComponent, PropType } from 'vue'
import { useRouter } from 'vue-router'
import StartupLogo from '@/components/StartupLogo'
import { useUserStore } from '@/stores'
import { StartupItem } from '@/types'

const StartupCard = defineComponent({
  name: 'StartupCard',
  props: {
    startup: {
      type: Object as PropType<StartupItem>,
      required: true
    },
    viewMode: {
      type: Boolean,
      default: () => false
    }
  },
  setup(props) {
    const userStore = useUserStore()
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
        class="rounded-sm cursor-pointer flex py-4 px-4 items-center hover:bg-color-hover"
        onClick={toStartDetail}
      >
        <StartupLogo src={props.startup.logo} class="rounded-sm h-15 mr-4 w-15" />
        <div class="flex-1">
          <div class="mb-2 text-color1 u-h4">{props.startup.name}</div>
          <div class="flex gap-2 items-center">
            {props.startup.hashTags.map((tag, i) => {
              return i + 1 < 4 ? (
                <>
                  <UTag key={i}>{tag.name}</UTag>
                </>
              ) : null
            })}
            {props.startup.hashTags.length - 4 > 0 ? (
              <UTag class="text-color1">+ {props.startup.hashTags.length - 4}</UTag>
            ) : null}
          </div>
        </div>
        {userStore.profile?.comerID === props.startup.comerID && (
          <>
            <SettingOutlined
              class="cursor-pointer rounded-2 h-5 ml-4 text-color2 w-5 hover:text-primary"
              onClick={basicSetting}
            />
          </>
        )}
      </div>
    )
  }
})

export default StartupCard
