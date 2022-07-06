import { UStartupLogo, UTag } from '@comunion/components'
import { format } from 'timeago.js'
import { defineComponent, onMounted, reactive, PropType, ref } from 'vue'
import { BOUNTY_TYPES_COLOR_MAP } from '@/constants'
import { ServiceReturn, services } from '@/services'

type BountyType = NonNullable<ServiceReturn<'bounty@startup-bounty-list'>>['rows']
const BountiesCard = defineComponent({
  name: 'BountiesCard',
  props: {
    startup: {
      type: Object as PropType<BountyType[number]>,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    }
  },
  setup(props, context) {
    const date = ref<string | undefined>()
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
    const color = BOUNTY_TYPES_COLOR_MAP.find(item => item.label === props.startup.status)
    onMounted(() => {
      getStartup(props.startup?.startupId)
      date.value = format(props.startup.createdTime, 'en_US')
    })

    return () => (
      <div class="flex h-38 w-full items-center cursor-pointer border-b-1 mt-8">
        <div class="flex h-full w-22 items-center">
          <UStartupLogo
            src={props.startup.logo}
            width="10"
            height="10"
            class="h-20 w-20 -mt-15 rounded-md"
          />
        </div>
        <div class="flex-1 h-full ml-6 w-full items-center">
          <div class="content w-full">
            <div class="flex w-full">
              <div
                class={[
                  props.name === 'startup' ? 'max-w-169' : 'max-w-89',
                  'u-title1 mb-4 truncate mr-2'
                ]}
              >
                {props.startup.title}
              </div>
              {props.name === 'dashboard' && props.status !== 'Success' && (
                <UTag type="filled" class="bg-primary1">
                  {props.status === 'Failure' ? 'fail to blockchain' : 'padding'}
                </UTag>
              )}
            </div>

            <div class="flex items-center flex-row mb-4">
              <div class="mr-2">
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
              <div class="mr-2">
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
              <div class="mr-2">
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
              <div class="u-body2 truncate text-grey3">
                {props.startup.applicantCount ?? 0} Applicant
              </div>
            </div>
            <div class="flex">
              <div class="mt-3">
                <span class="u-body2 text-grey2">Deposit requirements：</span>
                <span class="u-card-title2 text-warning">
                  {props.startup.depositRequirements} USDC
                </span>
              </div>
              <div class="flex-1"></div>
              <div class="flex justify-end">
                {props.startup.rewards &&
                  props.startup.rewards.map((item: { tokenSymbol: string; amount: string }, i) => {
                    return (
                      <div
                        key={i}
                        class={[
                          i === 0
                            ? 'mr-5 border-warning text-warning'
                            : '0px border-primary text-primary',
                          'w-25 h-10 flex items-center justify-center rounded-md border-1'
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
                            'u-title2 w-9.2 truncate'
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
            </div>
          </div>
        </div>
      </div>
    )
  }
})

export default BountiesCard
