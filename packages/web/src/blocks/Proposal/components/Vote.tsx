import { UDatePicker, UForm, UFormItem, UInput } from '@comunion/components'
import { ArrowDownOutlined, ConfirmOutlined } from '@comunion/icons'
import { defineComponent, PropType, ref, watch, computed } from 'vue'
import { ProposalInfo } from '../typing'

export const Vote = defineComponent({
  name: 'Vote',
  props: {
    proposalInfo: {
      type: Object as PropType<ProposalInfo>,
      required: true
    }
  },
  setup(props) {
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

    const votingOptions = [
      {
        label: 'Single choice voting',
        subLabel: 'Each voter can select only one choice.',
        key: 'single',
        value: 1
      },
      {
        label: 'Basic voting',
        subLabel: 'Single choice voting with three choices: Yes, No or Abstain',
        key: 'basic',
        value: 2
      }
    ]

    const selectedVotingInfo = computed(() => {
      return votingOptions.find(voting => voting.value === props.proposalInfo.vote)
    })

    const triggerVoteField = () => {
      showOptionsPanel.value = !showOptionsPanel.value
    }
    const choiceOption = (value: number) => {
      props.proposalInfo.vote = value
      showOptionsPanel.value = false
    }
    return {
      votingOptions,
      showOptionsPanel,
      triggerVoteField,
      choiceOption,
      selectedVotingInfo
    }
  },
  render() {
    return (
      <div>
        <UForm>
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
                {this.votingOptions.map(voting => (
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
                        {voting.subLabel}
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
              <UInput
                v-slots={{
                  prefix: <div class="u-body2 text-grey3">Choice {choiceIndex + 1}</div>,
                  suffix: <div class="u-body2 text-grey3">{voteChoice.length}/32</div>
                }}
                v-model:value={voteChoice}
                maxlength={32}
              ></UInput>
            ))}
          </div>
          <div class="u-body4 mb-3">Voting period</div>
          <div class="flex justify-between gap-14">
            <UFormItem
              label="Start Date(UTC)"
              labelStyle={{ fontSize: '12px' }}
              required
              class="w-full"
            >
              <UDatePicker v-model:value={this.proposalInfo.startTime} class="w-full"></UDatePicker>
            </UFormItem>
            <UFormItem
              label="End Date(UTC)"
              labelStyle={{ fontSize: '12px' }}
              required
              class="w-full"
            >
              <UDatePicker v-model:value={this.proposalInfo.endTime} class="w-full"></UDatePicker>
            </UFormItem>
          </div>
        </UForm>
      </div>
    )
  }
})
