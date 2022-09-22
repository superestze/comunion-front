import { UTag } from '@comunion/components'
import { CalendarOutlined, StageOutlined } from '@comunion/icons'
import dayjs from 'dayjs'
import { format } from 'timeago.js'
import { defineComponent, PropType, reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import UStartupLogo from '@/components/UStartupLogo'
import { BOUNTY_TYPES_COLOR_MAP } from '@/constants'
import { ServiceReturn, services } from '@/services'
import { getChainInfoByChainId } from '@/utils/etherscan'
import { checkSupportNetwork } from '@/utils/wallet'

type BountyType = NonNullable<ServiceReturn<'bounty@startup-bounty-list'>>['rows']

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
    const theChainName = getChainInfoByChainId(props.startup.chainID)?.shortName

    onMounted(() => {
      getStartup(props.startup?.startupId)
      date.value = format(props.startup.createdTime, 'comunionTimeAgo')
    })
    const isExpired = dayjs.utc(props.startup.applyCutoffDate).unix() <= dayjs().utcOffset(0).unix()
    const status = props.startup.applicantCount <= 0 && isExpired ? 'Expired' : props.startup.status
    const color = BOUNTY_TYPES_COLOR_MAP.find((item: { label: string }) => {
      return item.label === status
    })

    const handleCard = (bountyId: number) => async () => {
      const isSupport = await checkSupportNetwork(props.startup.chainID, () => {
        router.push(`/bounty/${bountyId}`)
      })
      if (isSupport) {
        router.push(`/bounty/${bountyId}`)
      }
    }

    const wrapClass = props.miniCard
      ? 'bg-white rounded-sm cursor-pointer py-4 px-4 hover:bg-color-hover'
      : 'bg-white rounded-sm cursor-pointer border border-color-border mb-4 px-6 py-6 hover:bg-color-hover'

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
        <div class="flex items-start">
          <UStartupLogo src={props.startup.logo} class="h-15 mr-4 w-15" />

          <div class="flex-1 overflow-hidden">
            <div class="flex mb-2 items-center">
              <div
                class={['u-h4 text-color1 truncate', props.miniCard ? 'max-w-3/5' : 'max-w-4/5']}
              >
                {props.startup.title}
              </div>
              {/* style={{
                  'background-color': color ? color.value : BOUNTY_TYPES_COLOR_MAP[0].value
                }} */}
              <UTag class="ml-4 text-color2">
                {color ? color.label : BOUNTY_TYPES_COLOR_MAP[0].label}
              </UTag>
            </div>
            {/* skill tags miniCard */}
            <div class="flex flex-wrap gap-2">
              {skillTagsList.map((tag: string, i: number) => {
                return (
                  <UTag key={i} class="text-color1">
                    {tag}
                  </UTag>
                )
              })}
              {props.miniCard && props.startup.applicationSkills.length > skillTagShowLength && (
                <UTag class="text-color1">
                  +{props.startup.applicationSkills.length - skillTagShowLength}
                </UTag>
              )}
            </div>
          </div>
          <div class="flex font-primary text-primary items-center">
            {props.startup.rewards?.map(
              (item: { tokenSymbol: string; amount: number }, i: number) => {
                return (
                  <>
                    {i > 0 && (
                      <span key={i} class="mx-1 text-base ">
                        +
                      </span>
                    )}
                    <span key={i} class="mr-0.5 u-num1 ">
                      {item.amount}
                    </span>
                    <span key={i} class="align-middle u-h7">
                      {item.tokenSymbol}
                    </span>
                  </>
                )
              }
            )}
          </div>
        </div>
        <div class="flex font-primary ml-4.5rem text-color3 items-center u-h7">
          <div class="flex flex-1 items-center">
            {props.startup.paymentType === 'Stage' ? (
              <StageOutlined class="h-4 w-4" />
            ) : (
              <CalendarOutlined class="h-4 w-4" />
            )}
            <span class="ml-2 ">{props.startup.paymentType}</span>
            <strong class="mx-2">·</strong>
            <span class="text-color3 ">Created {date.value}</span>
            <strong class=" mx-2">·</strong>
            <span class="text-color3">{props.startup.applicantCount ?? 0} Applicant</span>
          </div>
          {theChainName && (
            <img src={getChainInfoByChainId(props.startup.chainID)?.logo} class="h-4 mr-1 w-4" />
          )}
          <span>Deposit：</span>
          <span class="text-color1  truncate">
            <span class="mr-1 u-num2">{props.startup.depositRequirements}</span>
            <span class="u-h7">{props.startup.depositTokenSymbol}</span>
          </span>
        </div>
      </div>
    )
  }
})
