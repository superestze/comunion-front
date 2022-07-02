import { UStartupLogo, UTag } from '@comunion/components'
import { defineComponent, PropType } from 'vue'
// import { useRouter } from 'vue-router'
import { StartupItem } from '@/types'

const AapprobedCard = defineComponent({
  name: 'AapprobedCard',
  props: {
    startup: {
      type: Object as PropType<StartupItem>,
      required: true
    }
  },
  setup(props, context) {
    // const router = useRouter()

    // const basicSetting = (e: Event) => {
    //   e.stopPropagation()
    //   router.push({ path: '/basicsetting', query: { startupId: props.startup.id } })
    // }
    // const financeSetting = (e: Event) => {
    //   e.stopPropagation()
    //   router.push({ path: '/financesetting', query: { startupId: props.startup.id } })
    // }
    // const toStartDetail = () => {
    //   router.push({ path: '/startup/detail', query: { startupId: props.startup.id } })
    // }
    const dataList = [
      {
        label: 'Ready to work',
        color: '#00BFA5'
      },
      {
        label: 'Stage',
        color: '#1C60F3'
      },
      {
        label: 'created 5 hours ago',
        color: '#3F2D99'
      }
    ]

    return () => (
      <div class="flex h-38 w-full items-center cursor-pointer border-b-1 ">
        <div class="flex h-full w-22 items-center">
          <UStartupLogo src={props.startup.logo} width="10" height="10" class="h-20 w-20 -mt-8" />
        </div>
        <div class="flex h-full ml-6 w-full items-center">
          <div class="content">
            <div class="u-title1 mb-4 max-w-128 truncate">{props.startup.name}</div>
            <div class="flex items-center flex-row mb-4">
              <div class="mr-5">
                {dataList.map((tag, i) => {
                  return i + 1 < 4 ? (
                    <UTag
                      class={[i === 0 ? 'p-0' : 'ml-2', `px-2`]}
                      key={i}
                      style={{
                        'border-color': tag.color
                      }}
                    >
                      {tag.label}
                    </UTag>
                  ) : null
                })}
              </div>
              <div class="u-body2 truncate text-grey3">6 Applicants</div>
            </div>
            <div class="flex">
              <div class="mt-5">
                <span class="u-body2 text-grey2">Deposit requirements：</span>
                <span class="u-card-title2 text-warning">20 USDC</span>
              </div>
              <div class="flex-1 w-10"></div>
              <div class="flex justify-end">
                <div
                  class="w-25 h-10 flex items-center justify-center rounded-md"
                  style={{
                    background: 'rgba(var(--u-warning2-value), 0.1) ',
                    border: '1px solid var(--u-warning-color)'
                  }}
                >
                  <span class="u-title2 w-9.5 text-warning truncate">1000</span>
                  <span class="pl-1 u-title2 text-warning">USDC</span>
                </div>
                <div class="w-2.5"></div>
                <div
                  class="w-25 h-10 flex items-center justify-center rounded-md"
                  style={{
                    background: 'rgba(var(--u-primary-value), 0.1)',
                    border: '1px solid var(--u-primary-color)'
                  }}
                >
                  <span class="u-title2 w-9.5 text-primary truncate">1000</span>
                  <span class="pl-1 u-title2 text-primary">UVU</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

export default AapprobedCard
