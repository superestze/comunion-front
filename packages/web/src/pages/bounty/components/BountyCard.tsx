import { UStartupLogo, UTag } from '@comunion/components'
// import dayjs from 'dayjs'
import { CalendarOutlined, StageOutlined } from '@comunion/icons'
import { format } from 'timeago.js'
import { defineComponent, PropType, reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
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
    const router = useRouter()
    const bountyInfo = reactive({
      token2Symbol: ''
    })
    const date = ref<string>()
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
      date.value = format(props.startup.createdTime, 'comunionTimeAgo')
    })
    const color = BOUNTY_TYPES_COLOR_MAP.find(
      (item: { label: string }) => item.label === props.startup.status
    )

    const handleCard = (bountyId: number) => () => {
      router.push(`/bounty/detail?bountyId=${bountyId}&from=0`)
    }

    return () => (
      <div
        class="h-36 cursor-pointer border-1 bg-white rounded-md px-10 mb-1.5rem pt-2rem hover:shadow-md"
        style="transition:all ease .3s"
        onClick={handleCard(props.startup.bountyId)}
      >
        <div class="flex mb-3">
          <UStartupLogo
            src={props.startup.logo}
            width="10"
            height="10"
            class="h-3.75rem w-3.75rem rounded-md mr-3"
          />

          <div class="flex-1 ">
            <div class="flex items-center mb-2">
              <div class="max-w-50rem text-[#333] font-700 text-1rem truncate leading-7">
                {props.startup.title}
              </div>
              <span
                class="inline-block px-2 h-1.25rem leading-1.25rem text-0.75rem rounded-sm ml-2"
                style={{
                  'background-color': color ? color.value : BOUNTY_TYPES_COLOR_MAP[0].value,
                  color: '#fff'
                }}
              >
                {color ? color.label : BOUNTY_TYPES_COLOR_MAP[0].label}
              </span>
            </div>
            <div class="flex items-center flex-row">
              {props.startup.applicationSkills.length &&
                props.startup.applicationSkills.map((tag: string, i: number) => {
                  return (
                    <UTag
                      key={i}
                      class="px-2 mr-2 !h-1.25rem !leading-1.25rem !text-[#3F2D99] !border-[#3F2D99]"
                    >
                      {tag}
                    </UTag>
                  )
                })}
            </div>
          </div>

          {props.startup.rewards?.map((item: { tokenSymbol: string; amount: string }, i) => {
            return (
              <div
                key={i}
                class={[
                  i === 0 ? 'border-warning text-warning' : 'border-primary text-primary',
                  'inline-block ml-2 px-2 h-6 leading-6 rounded border-1 '
                ]}
                style={{
                  background:
                    i === 0
                      ? 'rgba(var( --u-warning2-value), 0.1)'
                      : 'rgba(var(--u-primary-value), 0.1)'
                }}
              >
                <strong>{item.amount}</strong> {item.tokenSymbol}
              </div>
            )
          })}
        </div>
        <div class="flex items-center text-0.75rem ml-4.5rem">
          <div class="flex-1 flex items-center">
            <span class="text-[#5331F4] mr-1">
              {props.startup.paymentType === 'Stage' ? (
                <StageOutlined class="w-1rem h-1rem" />
              ) : (
                <CalendarOutlined class="w-1rem h-1rem" />
              )}
            </span>
            <span class="text-[#5331F4]">{props.startup.paymentType}</span>
            <span class="font-700 text-[#D9D9D9] mx-2">·</span>
            <span class="text-[#9F9F9F]">{props.startup.applicantCount ?? 0} Applicant</span>
            <span class="font-700 text-[#D9D9D9] mx-2">·</span>
            <span class="text-[#9F9F9F] ">Created {date.value}</span>
          </div>
          <span class="text-grey2">Deposit：</span>
          <em class="text-0.875rem font-700 text-[#F29F39]">
            {props.startup.depositRequirements} USDC
          </em>
        </div>
      </div>
    )
  }
})
export default StartupCard
