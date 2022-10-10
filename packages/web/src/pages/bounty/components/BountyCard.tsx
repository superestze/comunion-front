import { UTag } from '@comunion/components'
import { CalendarOutlined, StageOutlined } from '@comunion/icons'
import dayjs from 'dayjs'
import { format } from 'timeago.js'
import { defineComponent, PropType, reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import StartupLogo from '@/components/StartupLogo'
import { BOUNTY_TYPES_COLOR_MAP } from '@/constants'
import { services } from '@/services'
import { BountyItem } from '@/types'
import { getChainInfoByChainId } from '@/utils/etherscan'
import { checkSupportNetwork } from '@/utils/wallet'
// type BountyType = NonNullable<ServiceReturn<'bounty@startup-bounty-list'>>['rows']
type BountyType = BountyItem[]

export default defineComponent({
  name: 'BountyCard',
  props: {
    info: {
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
    const theChainName = getChainInfoByChainId(props.info.chainID)?.shortName

    onMounted(() => {
      getStartup(props.info?.startupId)
      date.value = format(props.info.createdTime, 'comunionTimeAgo')
    })
    const isExpired = dayjs.utc(props.info.applyCutoffDate).unix() <= dayjs().utcOffset(0).unix()
    const status = props.info.applicantCount <= 0 && isExpired ? 'Expired' : props.info.status
    const color = BOUNTY_TYPES_COLOR_MAP.find((item: { label: string }) => {
      return item.label === status
    })

    const handleCard = (bountyId: number) => async () => {
      checkSupportNetwork(props.info.chainID, () => router.push(`/bounty/${bountyId}`))
    }

    const wrapClass = props.miniCard
      ? 'bg-white rounded-sm cursor-pointer py-4 px-4 hover:bg-color-hover'
      : 'bg-white rounded-sm cursor-pointer border border-color-border mb-4 px-6 py-6 hover:bg-color-hover'

    const skillTagShowLength = 3
    const skillTagsList = props.miniCard
      ? props.info.applicationSkills.slice(0, skillTagShowLength)
      : props.info.applicationSkills

    return () => (
      <div
        class={wrapClass}
        style="transition:background ease .3s"
        onClick={handleCard(props.info.bountyId)}
      >
        <div class="flex items-start">
          <StartupLogo src={props.info.logo} class="h-15 mr-4 w-15" />

          <div class="flex-1 overflow-hidden">
            <div class="flex mb-2 items-center">
              <div
                class={['u-h4 text-color1 truncate', props.miniCard ? 'max-w-3/5' : 'max-w-4/5']}
              >
                {props.info.title}
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
              {props.miniCard && props.info.applicationSkills.length > skillTagShowLength && (
                <UTag class="text-color1">
                  +{props.info.applicationSkills.length - skillTagShowLength}
                </UTag>
              )}
            </div>
          </div>
          <div class="flex font-primary text-primary items-center">
            {props.info.rewards?.map((item: any, i: number) => {
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
            })}
          </div>
        </div>
        <div class="flex font-primary ml-4.5rem text-color3 items-center u-h7">
          <div class="flex flex-1 items-center">
            {props.info.paymentType === 'Stage' ? (
              <StageOutlined class="h-4 w-4" />
            ) : (
              <CalendarOutlined class="h-4 w-4" />
            )}
            <span class="ml-2 ">{props.info.paymentType}</span>
            <strong class="mx-2">·</strong>
            <span class="text-color3 ">Created {date.value}</span>
            <strong class=" mx-2">·</strong>
            <span class="text-color3">{props.info.applicantCount ?? 0} Applicant</span>
          </div>
          {theChainName && (
            <img src={getChainInfoByChainId(props.info.chainID)?.logo} class="h-4 mr-1 w-4" />
          )}
          <span>Deposit：</span>
          <span class="text-color1  truncate">
            <span class="mr-1 u-num2">{props.info.depositRequirements}</span>
            <span class="u-h7">{props.info.depositTokenSymbol}</span>
          </span>
        </div>
      </div>
    )
  }
})
