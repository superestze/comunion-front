import { UTag, UTooltip } from '@comunion/components'
import dayjs from 'dayjs'
import { format } from 'timeago.js'
import { defineComponent, ref, PropType, computed, onMounted } from 'vue'
import Paragraph from './paragraph'
import More from '@/components/More'
import { StretchTags } from '@/components/Tags'
import { BOUNTY_TYPES_COLOR_MAP } from '@/constants'
import { ServiceReturn } from '@/services'

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
    const bountyStatus = computed(() => {
      if (typeof props.bountyDetail?.status === 'number' && props.bountyDetail.status >= 0) {
        return BOUNTY_TYPES_COLOR_MAP[props.bountyDetail.status]
      }
      return {
        label: `error ${props.bountyDetail?.status}`,
        value: '#00BFA5'
      }
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
      if (pRef.value.ele.scrollHeight > pRef.value.ele.offsetHeight) {
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
          <div class="flex flex-col">
            <UTooltip trigger="hover">
              {{
                trigger: () => (
                  <span class="u-h2 whitespace-pre-wrap break-all overflow-hidden overflow-ellipsis line-clamp-2">
                    {this.bountyDetail?.title}
                  </span>
                ),
                default: () => this.bountyDetail?.title
              }}
            </UTooltip>
            {Array.isArray(this.bountyDetail?.applicantsSkills) && (
              <StretchTags tags={this.bountyDetail?.applicantsSkills} />
            )}
          </div>
          <UTag
            class="ml-5 text-12px w-110px flex justify-center flex-shrink-0"
            type="outlined"
            style={{
              color: this.bountyStatus.value
            }}
          >
            {this.bountyStatus.label}
          </UTag>
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
              label={this.contactLabel[(item.contactType || 0) - 1]}
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
          <div class="flex justify-end mt-20px">
            <More onMore={this.handleMore} fold={this.fold} />
          </div>
        )}
      </div>
    )
  }
})