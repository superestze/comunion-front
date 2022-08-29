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
    }
  },
  setup(props) {
    const fold = ref<boolean>(true)
    const handleMore = () => {
      fold.value = !fold.value
    }
    const bountyContractStore = useBountyContractStore()
    const bountyStatus = computed(() => {
      return BOUNTY_TYPES_COLOR_MAP[bountyContractStore.bountyContractInfo.bountyStatus]
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
        <div class="flex justify-between items-center">
          <div class="flex flex-col flex-grow">
            <UTooltip trigger="hover">
              {{
                trigger: () => (
                  <span class="whitespace-pre-wrap break-all overflow-hidden overflow-ellipsis u-h2 line-clamp-2">
                    {this.bountyDetail?.title}
                  </span>
                ),
                default: () => this.bountyDetail?.title
              }}
            </UTooltip>
            <div class="flex flex-row mt-5.5">
              {Array.isArray(this.bountyDetail?.applicantsSkills) &&
                this.bountyDetail?.applicantsSkills.map(value => (
                  <p class="border flex border-primary1 rounded-2px h-6 w-auto py-1 px-2 text-primary1 text-12px overflow-hidden items-center justify-center">
                    {value}
                  </p>
                ))}
            </div>
          </div>
          {this.bountyStatus && (
            <UTag
              class="flex flex-shrink-0 ml-5 text-12px w-110px justify-center"
              type="outlined"
              style={{
                color: this.bountyStatus.value
              }}
            >
              {this.bountyStatus.label}
            </UTag>
          )}
        </div>
        <Paragraph
          class="mt-40px"
          label="Created :"
          content={this.createdAt}
          contentClass="text-primary2"
        />
        {this.bountyDetail?.contact?.map(item => {
          return (
            <Paragraph
              class="mt-18px"
              label={`${this.contactLabel[(item.contactType || 0) - 1]} :`}
              content={item.contactAddress}
              contentClass="text-primary"
              pasteboard={true}
            />
          )
        })}
        <Paragraph
          class="mt-18px"
          label="Apply Cutoff Date :"
          content={dayjs.utc(this.bountyDetail?.expiresIn).format('YYYY-MM-DD UTC')}
          contentClass="text-primary2"
        />
        <Paragraph
          class="mt-18px"
          label="Applicants deposit :"
          content={`${this.bountyDetail?.applicantsDeposit} USDC`}
          contentClass="text-primary2"
        />
        <Paragraph
          class="mt-18px"
          label="Description :"
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
