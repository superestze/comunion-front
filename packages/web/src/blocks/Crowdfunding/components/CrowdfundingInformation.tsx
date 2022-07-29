import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UForm,
  UFormItemsFactory,
  UInputBigNumber,
  UInputNumberGroup,
  USelect,
  UTooltip
} from '@comunion/components'
import { SelectOption } from '@comunion/components/src/constants'
import { QuestionFilled } from '@comunion/icons'
import Big from 'big.js'
import dayjs from 'dayjs'
import { computed, defineComponent, Ref, PropType, ref, h, onMounted } from 'vue'
import { CrowdfundingInfo } from '../typing'
import { getBuyCoinAddress } from '../utils'
import { useWalletStore } from '@/stores'

export interface CrowdfundingInformationRef {
  crowdfundingInfoForm: FormInst | null
}

export const CrowdfundingInformation = defineComponent({
  name: 'CrowdfundingInformation',
  props: {
    crowdfundingInfo: {
      type: Object as PropType<CrowdfundingInfo>,
      required: true
    }
  },
  setup(props, ctx) {
    const walletStore = useWalletStore()
    const crowdfundingInfoForm = ref<FormInst | null>(null)
    const raiseGoalOptions = ref<SelectOption[]>(
      getBuyCoinAddress(props.crowdfundingInfo.sellTokenContract!)[walletStore.chainId as number]
    )
    // const getMainCoin = async () => {}
    onMounted(() => {
      props.crowdfundingInfo.buyTokenContract = raiseGoalOptions.value[0].value as string
      props.crowdfundingInfo.buyTokenName = raiseGoalOptions.value[0].label as string
    })
    const totalSellToken = computed(() => {
      if (props.crowdfundingInfo.raiseGoal && props.crowdfundingInfo.buyPrice) {
        const sellTokenDeposit = new Big(props.crowdfundingInfo.raiseGoal)
          .times(new Big(props.crowdfundingInfo.buyPrice))
          .toString()
        props.crowdfundingInfo.sellTokenDeposit = Number(sellTokenDeposit)
        return sellTokenDeposit
      } else {
        props.crowdfundingInfo.sellTokenDeposit = 0
        return 0
      }
    })
    const renderSelect = computed(() => (
      <USelect
        class="w-30 text-center"
        options={raiseGoalOptions.value}
        v-model:value={props.crowdfundingInfo.buyTokenContract}
        onUpdateValue={(value, option: SelectOption) =>
          (props.crowdfundingInfo.buyTokenName = option.label)
        }
      />
    ))
    const formFields: Ref<FormFactoryField[]> = computed(() => [
      {
        t: 'custom',
        title: 'Raise Goal',
        name: 'raiseGoal',
        formItemProps: {
          first: true
        },
        class: '!grid-rows-[28px,1fr,1fr]',
        slots: {
          label: () => [
            h(
              <div>
                Raise Goal<span class="n-form-item-label__asterisk">&nbsp;*</span>
              </div>
            )
          ]
        },
        rules: [
          {
            validator: () => {
              return !!props.crowdfundingInfo.raiseGoal
            },
            message: 'Raise Goal cannot be blank',
            trigger: ['blur']
          },
          {
            validator: () =>
              !!props.crowdfundingInfo.raiseGoal && props.crowdfundingInfo.raiseGoal > 0,
            message: 'Raise goal must be positive  number',
            trigger: ['blur']
          }
        ],
        render(value) {
          return (
            <div class="flex-1 flex items-center">
              <UInputNumberGroup
                inputProps={{
                  placeholder: 'EX：10',
                  maxlength: 20,
                  precision: 18
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
        class: '!grid-rows-[28px,1fr,1fr]',
        formItemProps: {
          first: true,
          themeOverrides: {
            feedbackFontSizeMedium: '12px'
          },
          feedback:
            props.crowdfundingInfo.swapPercent === undefined ||
            Number(props.crowdfundingInfo.swapPercent) > 0
              ? `${props.crowdfundingInfo.swapPercent || '?'} % of the raised funds will go into the
              swap pool`
              : undefined
        },
        slots: {
          label: () => [
            h(
              <div class="flex items-end">
                Swap(%)
                <span class="n-form-item-label__asterisk">&nbsp;*</span>
                <UTooltip placement="right">
                  {{
                    trigger: () => <QuestionFilled class="text-grey3" />,
                    default: () => (
                      <div class="w-60">
                        Part of the funds raised will go into the swap pool as a fixed-price
                        exchangeable currency. and part will go directly to the team wallet
                      </div>
                    )
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
            trigger: ['input']
          },
          {
            validator: (rule, value) => value > 0,
            message: 'Swap must be positive number',
            renderMessage() {
              return <span>Swap must be positive number</span>
            },
            trigger: 'blur'
          }
        ],
        render(value) {
          return (
            <div class="flex-1">
              <UInputBigNumber
                placeholder="EX：70"
                max="100"
                precision={18}
                v-model:value={props.crowdfundingInfo.swapPercent}
                class="flex-1"
              ></UInputBigNumber>
            </div>
          )
        }
      },
      {
        t: 'custom',
        title: 'IBO Rate',
        name: 'buyPrice',
        class: '!grid-rows-[28px,1fr,1fr]',
        formItemProps: {
          first: true,
          themeOverrides: {
            feedbackFontSizeMedium: '12px'
          },
          feedback:
            props.crowdfundingInfo.buyPrice === undefined ||
            (!!props.crowdfundingInfo.buyPrice &&
              new Big(props.crowdfundingInfo.buyPrice).gt(new Big(0)))
              ? 'The price is at when investors buy token during Crowdfunding'
              : undefined
        },
        slots: {
          label: () => [
            h(
              <div class="flex items-end">
                IBO Rate
                <span class="n-form-item-label__asterisk">&nbsp;*</span>
                <span class="ml-1 u-body2">
                  1 {props.crowdfundingInfo.buyTokenName} = {props.crowdfundingInfo.buyPrice || '?'}{' '}
                  {props.crowdfundingInfo.sellTokenName}
                </span>
              </div>
            )
          ]
        },
        rules: [
          {
            validator: (rule, value) => !!value,
            message: 'Swap cannot be blank',
            trigger: ['input']
          },
          {
            validator: (rule, value) => value > 0,
            message: 'Swap must be positive number',
            trigger: 'blur'
          }
        ],
        render(value) {
          return (
            <UInputBigNumber
              placeholder="EX:10"
              maxlength="20"
              precision={18}
              v-model:value={props.crowdfundingInfo.buyPrice}
              class="flex-1"
            ></UInputBigNumber>
          )
        }
      },
      {
        t: 'custom',
        title: 'Maximum Buy',
        name: 'maxBuyAmount',
        class: '!grid-rows-[28px,1fr,1fr]',
        formItemProps: {
          first: true
        },
        slots: {
          label: () => [
            h(
              <div>
                Maximum Buy ({props.crowdfundingInfo.buyTokenName})
                <span class="n-form-item-label__asterisk">&nbsp;*</span>
              </div>
            )
          ]
        },
        rules: [
          {
            validator: (rule, value) => !!value,
            message: 'Maximum Buy cannot be blank',
            trigger: ['input']
          },
          {
            validator: (rule, value) => value > 0,
            message: 'Maximum Buy  must be positive  number',
            trigger: 'blur'
          }
        ],
        render(value) {
          return (
            <UInputBigNumber
              placeholder="EX: 10"
              precision={18}
              maxlength="20"
              v-model:value={props.crowdfundingInfo.maxBuyAmount}
              class="flex-1"
            ></UInputBigNumber>
          )
        }
      },
      {
        t: 'custom',
        title: 'Sell Tax',
        class: '!grid-rows-[28px,1fr,1fr]',
        slots: {
          label: () => [
            h(
              <div class="flex items-end">
                Sell Tax(%)
                <span class="n-form-item-label__asterisk">&nbsp;*</span>{' '}
                {/* <span>
                  1 {props.crowdfundingInfo.buyTokenName} = {props.crowdfundingInfo.buyPrice || '?'}{' '}
                  {props.crowdfundingInfo.sellTokenName}
                </span> */}
              </div>
            )
          ]
        },
        name: 'sellTax',
        formItemProps: {
          first: true,
          themeOverrides: {
            feedbackFontSizeMedium: '12px'
          },
          feedback:
            props.crowdfundingInfo.sellTax === undefined ||
            (!!props.crowdfundingInfo.sellTax &&
              new Big(props.crowdfundingInfo.sellTax).gt(new Big(0)))
              ? 'Fees to be deducted when investors sell tokens'
              : undefined
        },
        rules: [
          {
            validator: (rule, value) => !!value,
            message: 'Maximum Sell cannot be blank',
            trigger: ['input']
          },
          {
            validator: (rule, value) => value > 0,
            message: 'Maximum Buy  must be positive  number',
            trigger: 'blur'
          }
        ],
        render(value) {
          return (
            <div class="w-full">
              <UInputBigNumber
                max="100"
                precision={18}
                placeholder="EX:10"
                v-model:value={props.crowdfundingInfo.sellTax}
                class="flex-1"
              ></UInputBigNumber>
            </div>
          )
        }
      },
      {
        t: 'custom',
        title: 'Maximum Sell (%)',
        name: 'maxSell',
        class: '!grid-rows-[28px,1fr,1fr]',
        slots: {
          label: () => [
            h(
              <div class="flex items-end">
                Maximum Sell (%)
                <span class="n-form-item-label__asterisk">&nbsp;*</span>{' '}
              </div>
            )
          ]
        },
        rules: [
          {
            validator: (_rule, value) => !!value,
            message: 'Maximum Sell cannot be blank',
            trigger: ['input']
          },
          {
            validator: (rule, value) => value > 0,
            message: 'Maximum Buy  must be positive  number',
            trigger: 'blur'
          }
        ],
        formItemProps: {
          first: true,
          themeOverrides: {
            feedbackFontSizeMedium: '12px'
          },
          feedback:
            props.crowdfundingInfo.maxSell === undefined ||
            (!!props.crowdfundingInfo.maxSell &&
              new Big(props.crowdfundingInfo.maxSell).gt(new Big(0)))
              ? 'Maximum sellable is the  percentage of token each investor can sell'
              : undefined
        },
        render(value) {
          return (
            <UInputBigNumber
              max="100"
              precision={18}
              v-model:value={props.crowdfundingInfo.maxSell}
              class="flex-1"
            ></UInputBigNumber>
          )
        }
      },
      {
        t: 'date',
        title: 'Start Date (UTC)',
        name: 'startTime',
        type: 'datetime',
        class: 'w-full !grid-rows-[28px,1fr,1fr]',
        actions: ['clear', 'confirm'],
        format: 'yyyy-MM-dd HH:mm',
        rules: [
          { required: true, message: 'Please set the start Time' },
          {
            validator: (rule, value) => {
              if (!value || !props.crowdfundingInfo.endTime) return true
              return dayjs(value).isBefore(dayjs(props.crowdfundingInfo.endTime))
            },
            message: 'Start time needs to be before End time',
            trigger: ['input']
          }
        ],
        isDateDisabled: (current: number) => {
          return dayjs(current) < dayjs()
        },
        placeholder: 'select a date'
      },
      {
        t: 'date',
        title: 'End Date (UTC)',
        name: 'endTime',
        type: 'datetime',
        class: 'w-full !grid-rows-[28px,1fr,1fr]',
        actions: ['clear', 'confirm'],
        format: 'yyyy-MM-dd HH:mm',
        rules: [
          { required: true, message: 'Please set the end time' },
          {
            validator: (rule, value) => {
              if (!value || !props.crowdfundingInfo.startTime) return true
              return dayjs(value).isAfter(dayjs(props.crowdfundingInfo.startTime))
            },
            message: 'End time needs to be after Start time',
            trigger: ['input']
          }
        ],
        isDateDisabled: (current: number) => {
          return dayjs(current) < dayjs()
        },
        placeholder: 'select a date'
      }
    ])

    const crowdfundingInfoRules = getFieldsRules(formFields.value)
    ctx.expose({
      crowdfundingInfoForm
    })
    return {
      formFields,
      crowdfundingInfoForm,
      crowdfundingInfoRules,
      totalSellToken
    }
  },
  render() {
    return (
      <div>
        <UForm
          ref={(ref: any) => (this.crowdfundingInfoForm = ref)}
          rules={this.crowdfundingInfoRules}
          model={this.crowdfundingInfo}
          class="grid grid-cols-2 gap-x-10"
        >
          <UFormItemsFactory fields={this.formFields} values={this.crowdfundingInfo} />
        </UForm>
        <div class="bg-purple px-6 py-5.5 rounded-lg mt-4">
          Need <span class="text-primary">{this.totalSellToken}</span> UVU to create Crowdfunding.
        </div>
      </div>
    )
  }
})
