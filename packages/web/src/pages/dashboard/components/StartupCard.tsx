import { UButton, ULazyImage } from '@comunion/components'
import { defineComponent, PropType } from 'vue'
import { useRouter } from 'vue-router'
import { StartupItem } from '@/types'

const StartupCard = defineComponent({
  name: 'StartupCard',
  props: {
    startup: {
      type: Object as PropType<StartupItem>
    }
  },
  setup(props, context) {
    const router = useRouter()
    const { startup } = props

    const setStartup = () => {
      router.push({ path: '/startupset', query: { startupId: startup.id } })
    }
    return () => (
      <div class="h-28 w-full flex items-center">
        <div class="h-full flex items-center w-22">
          <ULazyImage src={startup.logo} class="h-18 w-18 rounded" />
        </div>
        <div class="border-b-1 h-full w-full flex items-center ml-6 border-gray-5">
          <div class="content">
            <div class="font-opensans font-600 text-[20px] mb-2 leading-6">{startup.name}</div>
            <div class="divide-x">
              {startup.hashTags.map((tag, i) => (
                <span
                  class={`${
                    i !== 0 ? 'pl-2' : ''
                  } pr-2 tracking-normal font-opensans font-400 text-[14px] leading-5`}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
          <div class="justify-end ml-auto">
            <UButton
              class="w-30 h-12  font-opensans rounded-2 text-white text-[16px]"
              type="primary"
              onClick={setStartup}
            >
              Set
            </UButton>
          </div>
        </div>
      </div>
    )
  }
})

export default StartupCard
