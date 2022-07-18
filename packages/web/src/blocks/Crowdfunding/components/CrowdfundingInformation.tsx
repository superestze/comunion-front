import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UForm,
  UFormItemsFactory,
  UInputNumber,
  UInputNumberGroup,
  USelect,
  UTooltip
} from '@comunion/components'
import { SelectOption } from '@comunion/components/src/constants'
import { QuestionFilled } from '@comunion/icons'
import { computed, defineComponent, Ref, PropType, ref, h } from 'vue'
import { CrowdfundingInfo } from '../typing'

export const CrowdfundingInformation = defineComponent({
  name: 'CrowdfundingInformation',
  props: {
    crowdfundingInfo: {
      type: Object as PropType<CrowdfundingInfo>,
      required: true
    }
  },
  setup(props) {
    const crowdfundingInfoForm = ref<FormInst | null>(null)
    const raiseGoalOptions = ref<SelectOption[]>([{ value: '1', label: '1' }])
    // const getMainCoin = async () => {}
    const renderSelect = computed(() => (
      <USelect
        class="w-30 text-center"
        options={raiseGoalOptions.value}
        v-model:value={props.crowdfundingInfo.buyTokenContract}
      />
    ))
    const formFields: Ref<FormFactoryField[]> = computed(() => [
      {
        t: 'custom',
        title: 'Raise Goal',
        name: 'raiseGoal',
        first: true,
        rules: [
          {
            validator: (rule, value) => !!value,
            message: 'Raise Goal cannot be blank',
            trigger: 'blur'
          },
          {
            validator: (rule, value) => value > 0,
            message: 'Raise goal must be positive  number',
            trigger: 'blur'
          }
        ],
        render(value) {
          return (
            <div class="flex-1 flex items-center">
              <UInputNumberGroup
                inputProps={{
                  precision: 18,
                  min: 2,
                  placeholder: 'EX：10'
                }}
                v-model:value={props.crowdfundingInfo.raiseGoal}
                class="flex-1"
                type="withSelect"
                renderSelect={() => renderSelect.value}
              ></UInputNumberGroup>
            </div>
          )
        }
      },
      {
        t: 'custom',
        title: 'Swap',
        name: 'swapPercent',
        first: true,
        slots: {
          label: () => [
            h(
              <div class="flex items-end">
                Swap(%)
                <span class="n-form-item-label__asterisk">&nbsp;*</span>
                <UTooltip placement="right">
                  {{
                    trigger: () => <QuestionFilled class="text-grey3" />,
                    default: () => 'Content'
                  }}
                </UTooltip>
              </div>
            )
          ]
        },
        rules: [
          {
            validator: (rule, value) => !!value,
            message: 'Swap cannot be blank',
            trigger: 'blur'
          },
          {
            validator: (rule, value) => value > 0,
            message: 'Swap must be positive number',
            trigger: 'blur'
          }
        ],
        render(value) {
          return (
            <div class="flex-1">
              <UInputNumber
                placeholder="EX：70"
                max={100}
                v-model:value={props.crowdfundingInfo.swapPercent}
                class="flex-1"
              ></UInputNumber>
              <div>{value || '?'} % of the raised funds will go into the swap pool</div>
            </div>
          )
        }
      },
      {
        t: 'custom',
        title: 'IBO Rate',
        name: 'buyPrice',
        slots: {
          label: () => [
            h(
              <div class="flex items-end">
                IBO Rate
                <span class="n-form-item-label__asterisk">&nbsp;*</span>{' '}
                <span>1 {props.crowdfundingInfo.buyPrice} = </span>
              </div>
            )
          ]
        },
        render(value) {
          return (
            <UInputNumber
              v-model:value={props.crowdfundingInfo.buyPrice}
              class="flex-1"
            ></UInputNumber>
          )
        }
      },
      {
        t: 'custom',
        title: 'Maximum Buy (USDC)',
        name: 'period',
        render(value) {
          return (
            <UInputNumber
              v-model:value={props.crowdfundingInfo.maxBuyAmount}
              class="flex-1"
            ></UInputNumber>
          )
        }
      },
      {
        t: 'custom',
        title: 'Sell Tax',
        name: 'period',
        render(value) {
          return (
            <UInputNumber
              v-model:value={props.crowdfundingInfo.sellTax}
              class="flex-1"
            ></UInputNumber>
          )
        }
      },
      {
        t: 'custom',
        title: 'Maximum Sell(%)',
        name: 'period',
        render(value) {
          return (
            <UInputNumber
              v-model:value={props.crowdfundingInfo.maxSell}
              class="flex-1"
            ></UInputNumber>
          )
        }
      },
      {
        t: 'date',
        title: 'Start Date(UTC)',
        name: 'period',
        class: 'w-full',
        actions: ['clear', 'confirm'],
        rules: [
          { required: true, message: 'Please set the apply cutoff date' }
          // {
          //   validator: (rule, value) => {
          //     if (!value) return true
          //     return dayjs(value) > dayjs()
          //   },
          //   message: 'Please set the reasonable cutoff date',
          //   trigger: 'blur'
          // }
        ],
        placeholder: 'Apply Cutoff Date (UTC)'
      },
      {
        t: 'date',
        title: 'End Date(UTC)',
        name: 'period',
        class: 'w-full',
        actions: ['clear', 'confirm'],
        rules: [
          { required: true, message: 'Please set the apply cutoff date' }
          // {
          //   validator: (rule, value) => {
          //     if (!value) return true
          //     return dayjs(value) > dayjs()
          //   },
          //   message: 'Please set the reasonable cutoff date',
          //   trigger: 'blur'
          // }
        ],
        placeholder: 'Apply Cutoff Date (UTC)'
      }
    ])

    const crowdfundingInfoRules = getFieldsRules(formFields.value)
    return {
      formFields,
      crowdfundingInfoForm,
      crowdfundingInfoRules
    }
  },
  render() {
    return (
      <UForm
        ref={(ref: any) => (this.crowdfundingInfoForm = ref)}
        rules={this.crowdfundingInfoRules}
        model={this.crowdfundingInfo}
        class="grid grid-cols-2 gap-x-10"
      >
        <UFormItemsFactory fields={this.formFields} values={this.crowdfundingInfo} />
      </UForm>
    )
  }
})
