import { UStartupLogo } from '@comunion/components'
import { BasicSettingFilled, FinanceSettingFilled } from '@comunion/icons'
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

    const basicSetting = () => {
      router.push({ path: '/startupset', query: { startupId: props.startup!.id } })
    }
    const financeSetting = () => {
      router.push({ path: '/financeset', query: { startupId: props.startup!.id } })
    }
    const styles = {
      combinationStyle: 'pr-2 tracking-normal font-opensans font-400 text-[14px] leading-5'
    }
    return () => (
      <div class="h-28 w-full flex items-center">
        <div class="h-full flex items-center w-22">
          <UStartupLogo src={props.startup!.logo} width="8" height="8" class="w-18 h-18 rounded" />
        </div>
        <div class="border-b-1 h-full w-full flex items-center ml-6 border-gray-5">
          <div class="content">
            <div class="font-opensans font-600 text-[20px] mb-2 leading-6">
              {props.startup!.name}
            </div>
            <div class="divide-x">
              {props.startup!.hashTags.map((tag, i) => {
                return i + 1 < 4 ? (
                  <span class={[i === 0 ? '' : 'pl-2', styles.combinationStyle]}>{tag.name}</span>
                ) : null
              })}
            </div>
          </div>
          <div class="justify-end ml-auto mr-1">
            <BasicSettingFilled
              class="rounded-2 w-12 h-12 cursor-pointer mr-3"
              onClick={basicSetting}
            />
            <FinanceSettingFilled
              class="rounded-2 w-12 h-12 cursor-pointer"
              onClick={financeSetting}
            />
          </div>
        </div>
      </div>
    )
  }
})

export default StartupCard
