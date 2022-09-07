import { UStartupLogo, UTag } from '@comunion/components'
import { CalendarOutlined, StageOutlined } from '@comunion/icons'
import dayjs from 'dayjs'
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
    },
    miniCard: {
      // miniCard style
      type: Boolean
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
    const isExpired = dayjs.utc(props.startup.applyCutoffDate).unix() <= dayjs().utcOffset(0).unix()
    const status = props.startup.applicantCount <= 0 && isExpired ? 'Expired' : props.startup.status
    const color = BOUNTY_TYPES_COLOR_MAP.find((item: { label: string }) => {
      return item.label === status
    })

    const handleCard = (bountyId: number) => () => {
      router.push(`/bounty/detail?bountyId=${bountyId}&from=0`)
    }

    const wrapClass = props.miniCard
      ? 'bg-white cursor-pointer py-2 mt-1.5rem '
      : 'bg-white rounded-md cursor-pointer border-1 h-40 mb-1.5rem px-10 pt-2rem hover:shadow-md'

    const skillTagShowLength = 4
    const skillTagsList = props.miniCard
      ? props.startup.applicationSkills.slice(0, skillTagShowLength)
      : props.startup.applicationSkills

    return () => (
      <div
        class={wrapClass}
        style="transition:all ease .3s"
        onClick={handleCard(props.startup.bountyId)}
      >
        <div class="flex mb-3 overflow-hidden">
          <UStartupLogo
            src={props.startup.logo}
            width="10"
            height="10"
            class="rounded-md h-15 mr-3 w-15"
          />

          <div class="flex-1 overflow-hidden">
            <div class="flex mb-2 items-center">
              <div class="font-700 max-w-4/5 text-[#333] text-1rem leading-7 truncate">
                {props.startup.title}
              </div>
              <span
                class="rounded-sm h-1.25rem ml-2 px-2 text-0.75rem leading-1.25rem inline-block"
                style={{
                  'background-color': color ? color.value : BOUNTY_TYPES_COLOR_MAP[0].value,
                  color: '#fff'
                }}
              >
                {color ? color.label : BOUNTY_TYPES_COLOR_MAP[0].label}
              </span>
            </div>
            {/* skill tags miniCard */}
            <div class="flex flex-row flex-wrap items-center">
              {skillTagsList.map((tag: string, i: number) => {
                return (
                  <UTag
                    key={i}
                    class="mr-2 mb-1 px-2 !border-[#3F2D99] !h-1.25rem !text-[#3F2D99] !leading-1.25rem"
                  >
                    {tag}
                  </UTag>
                )
              })}
              {props.miniCard && props.startup.applicationSkills.length > skillTagShowLength && (
                <UTag class="mr-2 mb-1 px-2 !border-[#3F2D99] !h-1.25rem !text-[#3F2D99] !leading-1.25rem">
                  +{props.startup.applicationSkills.length - skillTagShowLength}
                </UTag>
              )}
            </div>
          </div>

          {props.startup.rewards?.map((item: { tokenSymbol: string; amount: string }, i) => {
            return (
              <div
                key={i}
                class={[
                  i === 0 ? 'border-warning text-warning' : 'border-primary text-primary',
                  'inline-block ml-2 px-2 h-6 leading-1.375rem rounded border-1 truncate'
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
        <div
          class={
            'flex ml-4.5rem text-0.75rem items-center' +
            (props.miniCard ? ' pb-6 border-b border-grey5' : '')
          }
        >
          <div class="flex flex-1 items-center">
            <span class="mr-1 text-[#5331F4]">
              {props.startup.paymentType === 'Stage' ? (
                <StageOutlined class="h-1rem w-1rem" />
              ) : (
                <CalendarOutlined class="h-1rem w-1rem" />
              )}
            </span>
            <span class="text-[#5331F4]">{props.startup.paymentType}</span>
            <span class="font-700 mx-2 text-[#D9D9D9]">·</span>
            <span class="text-[#9F9F9F]">{props.startup.applicantCount ?? 0} Applicant</span>
            <span class="font-700 mx-2 text-[#D9D9D9]">·</span>
            <span class="text-[#9F9F9F] ">Created {date.value}</span>
          </div>
          <span class="text-grey2">Deposit：</span>
          <em class="text-[#F29F39] truncate u-body3">{props.startup.depositRequirements} USDC</em>
        </div>
      </div>
    )
  }
})
export default StartupCard
