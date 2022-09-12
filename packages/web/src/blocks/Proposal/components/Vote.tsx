import { UDatePicker, UForm, UFormItem, UInput } from '@comunion/components'
import {
  ArrowDownOutlined,
  ConfirmOutlined,
  AddCircleOutlined,
  MinusCircleOutlined
} from '@comunion/icons'
import dayjs from 'dayjs'
import { defineComponent, PropType, ref, watch, computed } from 'vue'
import { ProposalInfo } from '../typing'

export const Vote = defineComponent({
  name: 'Vote',
  props: {
    proposalInfo: {
      type: Object as PropType<ProposalInfo>,
      required: true
    },
    voteOptions: {
      type: Array as PropType<VoteOption[]>
    }
  },
  setup(props, ctx) {
    const proposalVoteFormRef = ref()
    const showOptionsPanel = ref(false)

    const clickEventListener = (e: Event) => {
      const oIpt = e.target as HTMLDivElement
      if (oIpt['id'] !== 'voting-field') {
        showOptionsPanel.value = false
      }
    }

    watch(
      () => showOptionsPanel.value,
      value => {
        console.log('value===>', value)
        if (value) {
          document.addEventListener('click', clickEventListener, true)
        } else {
          document.removeEventListener('click', clickEventListener, true)
        }
      }
    )

    const selectedVotingInfo = computed(() => {
      return props.voteOptions?.find(voting => voting.value === props.proposalInfo.vote)
    })

    const triggerVoteField = () => {
      showOptionsPanel.value = !showOptionsPanel.value
    }
    const choiceOption = (value: number) => {
      if (value === 2) {
        props.proposalInfo.voteChoices = [
          { value: 'Yes', disabled: true },
          { value: 'No', disabled: true },
          { value: 'Abstain', disabled: true }
        ]
      } else {
        props.proposalInfo.voteChoices = [{ value: '' }, { value: '' }]
      }
      props.proposalInfo.vote = value
      showOptionsPanel.value = false
    }
    const addVoteChoices = () => {
      props.proposalInfo.voteChoices.push({ value: '' })
    }

    const delVoteChoices = (index: number) => {
      const newChoices = props.proposalInfo.voteChoices.filter(
        (vote, voteIndex) => voteIndex !== index
      )
      props.proposalInfo.voteChoices = newChoices
    }
    ctx.expose({
      proposalVoteFormRef
    })
    return {
      showOptionsPanel,
      selectedVotingInfo,
      proposalVoteFormRef,
      triggerVoteField,
      choiceOption,
      addVoteChoices,
      delVoteChoices
    }
  },
  render() {
    return (
      <div>
        <UForm ref={(ref: any) => (this.proposalVoteFormRef = ref)} model={this.proposalInfo}>
          <UFormItem
            showFeedback={false}
            label="Voting"
            required
            class="relative flex flex-col mb-4"
          >
            <div
              class="w-full border rounded-lg px-4 py-2 flex justify-between items-center cursor-pointer"
              onClick={this.triggerVoteField}
              id="voting-field"
            >
              <div class="flex-1 flex items-center">
                <div class="u-body2 text-grey3">Voting system</div>
                <div class="text-primary ml-2">{this.selectedVotingInfo?.label}</div>
              </div>
              <ArrowDownOutlined class="text-grey4 w-4 h-4" />
            </div>
            {this.showOptionsPanel && (
              <div
                id="content"
                class="absolute inset-0 top-10 min-h-100 p-4 rounded z-1 bg-white"
                style={{ boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.097547)' }}
                onClick={e => e.stopPropagation()}
              >
                {this.voteOptions?.map(voting => (
                  <div
                    key={voting.key}
                    class={[
                      'mb-4 p-4 bg-white rounded flex justify-between items-center',
                      { 'border cursor-pointer': voting.value !== this.proposalInfo.vote },
                      { 'bg-[#5E18FE1A]': voting.value === this.proposalInfo.vote }
                    ]}
                    onClick={() => this.choiceOption(voting.value)}
                  >
                    <div>
                      <div class="u-label1 tracking-0px">{voting.label}</div>
                      <div class="u-tag" style={{ padding: 0 }}>
                        {voting.remark}
                      </div>
                    </div>
                    {voting.value === this.proposalInfo.vote && (
                      <div class="text-primary">
                        <ConfirmOutlined />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </UFormItem>
          <div class="mb-6">
            {this.proposalInfo.voteChoices.map((voteChoice, choiceIndex) => (
              <div class="flex items-center mb-3">
                <UFormItem
                  showFeedback={false}
                  showLabel={false}
                  class="w-full"
                  path="voteChoices"
                  rule={[
                    {
                      validator: () => {
                        if (choiceIndex === 0 && !voteChoice.value) {
                          return false
                        }
                        return true
                      }
                    }
                  ]}
                >
                  <UInput
                    v-slots={{
                      prefix: (
                        <div class="u-body2 text-grey3 w-20">
                          Choice {choiceIndex + 1}
                          {choiceIndex === 0 && (
                            <span class="n-form-item-label__asterisk text-error">&nbsp;*</span>
                          )}
                        </div>
                      ),
                      suffix: (
                        <div class="u-body2 text-grey3 pl-4">{voteChoice.value.length}/32</div>
                      )
                    }}
                    v-model:value={voteChoice.value}
                    maxlength={32}
                    disabled={voteChoice.disabled}
                    class={[{ 'max-w-184': this.selectedVotingInfo?.key !== 'basic' }]}
                  ></UInput>
                </UFormItem>
                {choiceIndex !== 0 && this.selectedVotingInfo?.key !== 'basic' && (
                  <div class="flex items-center">
                    <MinusCircleOutlined
                      class="mr-3 text-error cursor-pointer"
                      onClick={() => this.delVoteChoices(choiceIndex)}
                    />
                    {this.proposalInfo.voteChoices?.length === choiceIndex + 1 &&
                      this.proposalInfo.voteChoices?.length < 20 && (
                        <AddCircleOutlined class="cursor-pointer" onClick={this.addVoteChoices} />
                      )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div class="u-body4 mb-3">Voting period</div>
          <div class="flex justify-between gap-14">
            <UFormItem
              label="Start Date(UTC)"
              labelStyle={{ fontSize: '12px' }}
              class="w-full"
              path="startTime"
              rule={[
                { required: true, message: 'Please set the start Time' },
                {
                  validator: (rule, value) => {
                    if (!value || !this.proposalInfo.endTime) return true
                    return dayjs(value).isBefore(dayjs(this.proposalInfo.endTime))
                  },
                  message: 'Start time needs to be before End time',
                  trigger: ['blur']
                }
              ]}
            >
              <UDatePicker
                type="datetime"
                v-model:value={this.proposalInfo.startTime}
                format="yyyy-MM-dd HH:mm"
                class="w-full"
                isDateDisabled={(current: number) => {
                  return dayjs(current) < dayjs()
                }}
              ></UDatePicker>
            </UFormItem>
            <UFormItem
              label="End Date(UTC)"
              labelStyle={{ fontSize: '12px' }}
              class="w-full"
              path="endTime"
              rule={[
                { required: true, message: 'Please set the end time' },
                {
                  validator: (rule, value) => {
                    if (!value || !this.proposalInfo.startTime) return true
                    return dayjs(value).isAfter(dayjs(this.proposalInfo.startTime))
                  },
                  message: 'End time needs to be after Start time',
                  trigger: ['blur']
                }
              ]}
            >
              <UDatePicker
                type="datetime"
                v-model:value={this.proposalInfo.endTime}
                format="yyyy-MM-dd HH:mm"
                class="w-full"
                isDateDisabled={(current: number) => {
                  return dayjs(current) < dayjs()
                }}
              ></UDatePicker>
            </UFormItem>
          </div>
        </UForm>
      </div>
    )
  }
})
