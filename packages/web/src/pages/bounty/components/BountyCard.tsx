import { UStartupLogo, UTag } from '@comunion/components'
import { CalendarOutlined, StageOutlined } from '@comunion/icons'
import dayjs from 'dayjs'
import { format } from 'timeago.js'
import { defineComponent, PropType, reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { BOUNTY_TYPES_COLOR_MAP } from '@/constants'
import { ServiceReturn, services } from '@/services'

type BountyType = NonNullable<ServiceReturn<'bounty@bounty-list(tab)'>>['rows']
export default defineComponent({
  name: 'BountyCard',
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
      ? 'bg-white rounded-sm cursor-pointer py-4 px-4 hover:bg-color-hover'
      : 'bg-white rounded-sm cursor-pointer border-1 mb-6 px-6 py-6 hover:bg-color-hover'

    const skillTagShowLength = 3
    const skillTagsList = props.miniCard
      ? props.startup.applicationSkills.slice(0, skillTagShowLength)
      : props.startup.applicationSkills

    return () => (
      <div
        class={wrapClass}
        style="transition:background ease .3s"
        onClick={handleCard(props.startup.bountyId)}
      >
        <div class="flex mb-3 overflow-hidden">
          <UStartupLogo src={props.startup.logo} width="10" height="10" class="h-15 mr-3 w-15" />

          <div class="flex-1 overflow-hidden">
            <div class="flex mb-2 items-center">
              <div
                class={[
                  'u-h3 text-[#000] leading-7 truncate',
                  props.miniCard ? 'max-w-3/5' : 'max-w-4/5'
                ]}
              >
                {props.startup.title}
              </div>
              {/* style={{
                  'background-color': color ? color.value : BOUNTY_TYPES_COLOR_MAP[0].value
                }} */}
              <UTag class="ml-4">{color ? color.label : BOUNTY_TYPES_COLOR_MAP[0].label}</UTag>
            </div>
            {/* skill tags miniCard */}
            <div class="flex flex-row flex-wrap items-center">
              {skillTagsList.map((tag: string, i: number) => {
                return (
                  <UTag
                    key={i}
                    class="mr-2 mb-1 px-2 !border-[#DADCE0] !h-1.25rem !leading-1.25rem !u-h7"
                  >
                    {tag}
                  </UTag>
                )
              })}
              {props.miniCard && props.startup.applicationSkills.length > skillTagShowLength && (
                <UTag class="mr-2 mb-1 px-2 !border-[#DADCE0] !h-1.25rem !leading-1.25rem !u-h7">
                  +{props.startup.applicationSkills.length - skillTagShowLength}
                </UTag>
              )}
            </div>
          </div>

          {props.startup.rewards?.map((item: { tokenSymbol: string; amount: string }, i) => {
            return (
              // class={[
              //   i === 0 ? 'border-warning text-warning' : 'border-primary text-primary',
              //   'inline-block ml-2 px-2 h-6 leading-1.375rem rounded border-1 truncate'
              // ]}
              // style={{
              //   background:
              //     i === 0
              //       ? 'rgba(var( --u-warning2-value), 0.1)'
              //       : 'rgba(var(--u-primary-value), 0.1)'
              // }}
              <div key={i} class="font-primary text-primary text-[12px]">
                <span class="font-primary font-semibold text-primary mr-0.5 text-[14px] align-middle">
                  {item.amount}
                </span>
                <span class="align-middle">{item.tokenSymbol}</span>
              </div>
            )
          })}
        </div>
        <div class={'flex ml-4.5rem text-0.75rem items-center'}>
          <div class="flex flex-1 items-center">
            <span class="mr-1 text-color2">
              {props.startup.paymentType === 'Stage' ? (
                <StageOutlined class="h-1rem w-1rem" />
              ) : (
                <CalendarOutlined class="h-1rem w-1rem" />
              )}
            </span>
            <span class="text-color2">{props.startup.paymentType}</span>
            <span class="font-700 mx-2 text-color3">·</span>
            <span class="text-color3">{props.startup.applicantCount ?? 0} Applicant</span>
            <span class="font-700 mx-2 text-color3">·</span>
            <span class="text-color3 ">Created {date.value}</span>
          </div>
          <span class="font-primary text-color3">Deposit：</span>
          <span class="font-primary text-color1  truncate">
            <span class="font-primary font-semibold">{props.startup.depositRequirements}</span> USDC
          </span>
        </div>
      </div>
    )
  }
})
