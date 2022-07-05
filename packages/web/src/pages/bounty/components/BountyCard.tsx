import { UStartupLogo, UTag } from '@comunion/components'
// import { StartupLogoOutlined } from '@comunion/icons'
import { defineComponent, PropType, reactive, onMounted } from 'vue'
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
    })
    const color = BOUNTY_TYPES_COLOR_MAP.filter(item => item.label === props.startup.status)
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
              <div class="mb-4 mr-5">
                <UTag
                  class="px-2"
                  style={{
                    'border-color': color[0].value,
                    color: color[0].value
                  }}
                >
                  {color[0].label}
                </UTag>
              </div>
              <div class="u-body1 truncate mr-5 mb-4">{props.startup.paymentType}</div>
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
                      class="w-32.5 h-12 flex items-center justify-center rounded-md"
                      style={{
                        background:
                          item.tokenSymbol === bountyInfo.token2Symbol
                            ? 'linear-gradient(to right, rgba(var(--u-primary-value), 0.8),rgba(var(--u-primary-value), 1))'
                            : 'linear-gradient(to right, rgba(var( --u-warning2-value), 0.8),rgba(var( --u-warning2-value), 1))',
                        marginRight:
                          item.tokenSymbol === bountyInfo.token2Symbol ? '0px' : '1.25rem'
                      }}
                    >
                      <span class="pr-1 u-title1 w-11.5 text-white truncate">{item.amount}</span>
                      <span class="pl-1 u-title2 text-white">{item.tokenSymbol}</span>
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
