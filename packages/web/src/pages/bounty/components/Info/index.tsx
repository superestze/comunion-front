import { UTag, UTooltip } from '@comunion/components'
import dayjs from 'dayjs'
import { format } from 'timeago.js'
import { defineComponent, ref, computed, onMounted } from 'vue'
import Paragraph from './paragraph'
import More from '@/components/More'
import { BOUNTY_TYPES_COLOR_MAP } from '@/constants'

export default defineComponent({
  name: 'Info',
  props: {
    bountyDetail: {
      type: Object,
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
    // const bountyContractStore = useBountyContractStore()
    const bountyStatus = computed(() => {
      // let status = bountyContractStore.bountyContractInfo.bountyStatus
      let status = props.bountyDetail.value.status || 0
      if (props.bountyExpired) {
        status = 4
      }
      return BOUNTY_TYPES_COLOR_MAP[status]
    })
    const createdAt = computed(() => {
      if (props.bountyDetail.value.createdAt) {
        return format(props.bountyDetail.value.createdAt, 'comunionTimeAgo')
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
          <div class="flex flex-col flex-grow flex-1 overflow-hidden">
            <UTooltip width={400} placement="top-start" trigger="hover">
              {{
                trigger: () => (
                  <span class="text-color1  truncate u-h4">{this.bountyDetail.value.title}</span>
                ),
                default: () => this.bountyDetail.value.title
              }}
            </UTooltip>
            <div class="flex flex-wrap mt-5 gap-2">
              {Array.isArray(this.bountyDetail.value.applicantSkills) &&
                this.bountyDetail.value.applicantSkills.map((tag: string, i: number) => {
                  return (
                    <UTag key={i} class="text-color1">
                      {tag}
                    </UTag>
                  )
                })}
            </div>
          </div>
          {this.bountyStatus && <UTag class="ml-4">{this.bountyStatus.label}</UTag>}
        </div>
        <Paragraph
          class="mt-6 items-center"
          label={'Created :'}
          content={this.createdAt}
          contentClass="text-color2"
        />
        {this.bountyDetail.value.contact?.map((item: any) => {
          return (
            <Paragraph
              class="mt-4 items-center"
              label={`${this.contactLabel[(item.contactType || 0) - 1]} :`}
              content={item.contactAddress}
              contentClass="text-primary flex items-center"
              pasteboard={true}
            />
          )
        })}
        <Paragraph
          class="mt-4 items-center"
          label={'Apply Cutoff Date :'}
          content={dayjs.utc(this.bountyDetail.value.expiresIn).format('YYYY-MM-DD HH:mm UTC')}
          contentClass="text-color2 font-primary"
        />
        <Paragraph
          class="mt-4 items-center"
          label={'Applicants deposit :'}
          content={`${this.bountyDetail.value.applicantsDeposit} ${this.bountyDetail.value.depositTokenSymbol}`}
          contentClass="text-color2 font-primary"
        />
        <Paragraph
          class="mt-4 "
          label={'Description :'}
          content={this.bountyDetail.value.description}
          foldAble={true}
          fold={this.fold}
          maxHeight={300}
          contentClass="text-color3 font-primary"
          ref={(ref: any) => (this.pRef = ref)}
        />
        {this.showMoreBtn && (
          <div class="flex mt-6 justify-end">
            <More onMore={this.handleMore} fold={this.fold} />
          </div>
        )}
      </div>
    )
  }
})
