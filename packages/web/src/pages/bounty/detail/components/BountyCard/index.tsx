import { UTag, UTooltip } from '@comunion/components'
import dayjs from 'dayjs'
import { format } from 'timeago.js'
import { defineComponent, ref, PropType, computed, onMounted } from 'vue'
import Paragraph from './paragraph'
import More from '@/components/More'
import { BOUNTY_TYPES_COLOR_MAP } from '@/constants'
import { ServiceReturn } from '@/services'
import { useBountyContractStore } from '@/stores/bountyContract'

export default defineComponent({
  props: {
    bountyDetail: {
      type: Object as PropType<ServiceReturn<'bounty@bounty-get-detail'>>,
      required: true
    },
    bountyExpired: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const fold = ref<boolean>(true)
    const handleMore = () => {
      fold.value = !fold.value
    }
    const bountyContractStore = useBountyContractStore()
    const bountyStatus = computed(() => {
      let status = bountyContractStore.bountyContractInfo.bountyStatus
      if (props.bountyExpired) {
        status = 4
      }
      return BOUNTY_TYPES_COLOR_MAP[status]
    })
    const createdAt = computed(() => {
      if (props.bountyDetail?.createdAt) {
        return format(props.bountyDetail.createdAt, 'comunionTimeAgo')
      }
      return ''
    })
    const contactLabel = ['Email', 'Discord', 'Telegram']
    const pRef = ref<any>()
    const showMoreBtn = ref<boolean>()

    onMounted(() => {
      if (pRef.value.ele.scrollHeight > 60) {
        showMoreBtn.value = true
      }
    })

    return {
      createdAt,
      handleMore,
      fold,
      bountyStatus,
      contactLabel,
      pRef,
      showMoreBtn
    }
  },
  render() {
    return (
      <div>
        <div class="flex">
          <div class="flex flex-col flex-grow flex-1">
            <UTooltip width={400} placement="top-start" trigger="hover">
              {{
                trigger: () => <span class=" u-h4">{this.bountyDetail?.title}</span>,
                default: () => this.bountyDetail?.title
              }}
            </UTooltip>
            <div class="flex flex-wrap mt-5">
              {Array.isArray(this.bountyDetail?.applicantSkills) &&
                this.bountyDetail?.applicantSkills.map((tag: string, i: number) => {
                  return (
                    <UTag
                      key={i}
                      class="mr-2 mb-2 px-2 !border-[#3F2D99] !h-1.25rem !text-[#3F2D99] !leading-1.25rem"
                    >
                      {tag}
                    </UTag>
                  )
                })}
            </div>
          </div>
          {this.bountyStatus && (
            <span
              class="rounded-sm h-1.25rem mt-1 ml-2 px-2 text-0.75rem leading-1.25rem inline-block"
              style={{
                color: '#fff',
                'background-color': this.bountyStatus.value
              }}
            >
              {this.bountyStatus.label}
            </span>
          )}
        </div>
        <Paragraph
          class="mt-8"
          label={'Created :'}
          content={this.createdAt}
          contentClass="text-primary2"
        />
        {this.bountyDetail?.contact?.map(item => {
          return (
            <Paragraph
              class="mt-4"
              label={`${this.contactLabel[(item.contactType || 0) - 1]} :`}
              content={item.contactAddress}
              contentClass="text-primary"
              pasteboard={true}
            />
          )
        })}
        <Paragraph
          class="mt-4"
          label={'Apply Cutoff Date :'}
          content={dayjs.utc(this.bountyDetail?.expiresIn).format('YYYY-MM-DD HH:mm UTC')}
          contentClass="text-primary2"
        />
        <Paragraph
          class="mt-4"
          label={'Applicants deposit :'}
          content={`${this.bountyDetail?.applicantsDeposit} ${this.bountyDetail?.depositTokenSymbol}`}
          contentClass="text-primary2"
        />
        <Paragraph
          class="mt-4"
          label={'Description :'}
          content={this.bountyDetail?.description}
          foldAble={true}
          fold={this.fold}
          maxHeight={300}
          contentClass="text-primary2"
          ref={(ref: any) => (this.pRef = ref)}
        />
        {this.showMoreBtn && (
          <div class="flex mt-20px justify-end">
            <More onMore={this.handleMore} fold={this.fold} />
          </div>
        )}
      </div>
    )
  }
})
