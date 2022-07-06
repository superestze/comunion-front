import { UStartupLogo, UTag } from '@comunion/components'
// import dayjs from 'dayjs'
import { format } from 'timeago.js'
import { defineComponent, PropType, reactive, onMounted, ref } from 'vue'
import { BOUNTY_TYPES_COLOR_MAP } from '@/constants'
import { ServiceReturn, services } from '@/services'

type BountyType = NonNullable<ServiceReturn<'bounty@bounty-list(tab)'>>['rows']
const StartupCard = defineComponent({
  name: 'StartupCard',
  props: {
    startup: {
      type: Object as PropType<BountyType[number]>,
      required: true
    }
  },
  setup(props, ctx) {
    const bountyInfo = reactive({
      token2Symbol: ''
    })
    const date = ref<string | undefined>()
    const getStartup = async (startupId: number) => {
      if (startupId) {
        const { error, data } = await services['startup@startup-get']({
          startupId
        })
        if (!error) {
          bountyInfo.token2Symbol = data.tokenSymbol
        }
      }
    }

    onMounted(() => {
      getStartup(props.startup?.startupId)
      date.value = format(props.startup.createdTime, 'en_US')
    })
    const color = BOUNTY_TYPES_COLOR_MAP.find(
      (item: { label: string }) => item.label === props.startup.status
    )
    return () => (
      <div class="flex h-40 w-full items-center cursor-pointer border-b-1">
        <div class="flex h-full w-20 items-center">
          <UStartupLogo
            src={props.startup.logo}
            width="10"
            height="10"
            class="h-20 w-20 rounded-md -mt-1"
          />
        </div>
        <div class="flex-1 flex h-full ml-6 w-full items-center">
          <div class="content">
            <div class="u-title1 mb-2.5 max-w-200 truncate">{props.startup.title}</div>
            <div class="flex items-center flex-row">
              <div class="mb-4 mr-2">
                <UTag
                  class="px-2"
                  style={{
                    'border-color': color ? color.value : BOUNTY_TYPES_COLOR_MAP[0].value,
                    color: color ? color.value : BOUNTY_TYPES_COLOR_MAP[0].value
                  }}
                >
                  {color ? color.label : BOUNTY_TYPES_COLOR_MAP[0].label}
                </UTag>
              </div>
              <div class="mb-4 mr-2">
                <UTag
                  class="px-2"
                  style={{
                    'border-color': 'var(--u-success-color)',
                    color: 'var(--u-success-color)'
                  }}
                >
                  {props.startup.paymentType}
                </UTag>
              </div>
              <div class="mb-4 mr-2">
                <UTag
                  class="px-2"
                  style={{
                    'border-color': 'var(--u-primary-1-color)',
                    color: 'var(--u-primary-1-color)'
                  }}
                >
                  created {date.value}
                </UTag>
              </div>
              <div class="divide-x mb-4">
                {props.startup.applicationSkills.length &&
                  props.startup.applicationSkills.map((tag: string, i: number) => {
                    return i + 1 < 4 ? (
                      <span class={[i === 0 ? '' : 'pl-2', 'u-body1 text-grey1 pr-2']} key={i}>
                        {tag}
                      </span>
                    ) : null
                  })}
              </div>
            </div>

            <div class="u-body2 truncate text-grey3">
              {props.startup.applicantCount ?? 0} Applicant
            </div>
          </div>
        </div>
        <div class="flex h-full  items-center">
          <div class="flex h-full ml-6 w-full items-center">
            <div class="content">
              <div class="flex justify-end">
                {props.startup.rewards?.map((item: { tokenSymbol: string; amount: string }, i) => {
                  return (
                    <div
                      key={i}
                      class={[
                        i === 0
                          ? 'mr-5 border-warning text-warning'
                          : '0px border-primary text-primary',
                        'w-32.5 h-12 flex items-center justify-center rounded-md border-1'
                      ]}
                      style={{
                        background:
                          i === 0
                            ? 'rgba(var( --u-warning2-value), 0.1)'
                            : 'rgba(var(--u-primary-value), 0.1)'
                      }}
                    >
                      <span
                        class={[
                          i === 0 ? 'text-warning' : 'text-primary',
                          'pr-1 u-title1 w-11.5 truncate'
                        ]}
                      >
                        {item.amount}
                      </span>
                      <span class={[i === 0 ? 'text-warning' : 'text-primary', 'pl-1 u-title2']}>
                        {item.tokenSymbol}
                      </span>
                    </div>
                  )
                })}
              </div>
              <div class="flex justify-end mt-10">
                <span class="u-body2 text-grey2">Deposit requirements：</span>
                <span class="u-card-title2 text-warning">
                  {props.startup.depositRequirements} USDC
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})
export default StartupCard
