import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UForm,
  UFormItemsFactory,
  USelect,
  UInputNumberGroup
} from '@comunion/components'
import { defineComponent, PropType, ref, computed } from 'vue'
import { BountyInfo } from '../typing'
import { MAX_AMOUNT, renderUnit } from './BasicInfo'
import RichEditor from '@/components/Editor'

export interface PayDetailPeriodRef {
  payPeriodForm: FormInst | null
  payPeriodTotal: {
    usdcTotal: number
    tokenTotal: number
  }
}

const PayDetailPeriod = defineComponent({
  name: 'PayDetailPeriod',
  props: {
    bountyInfo: {
      type: Object as PropType<BountyInfo>,
      required: true
    }
  },
  emits: ['showLeaveTipModal'],
  setup(props, ctx) {
    const payPeriodForm = ref<FormInst | null>(null)
    const periodOptions = [
      { label: 'Days', value: 1 },
      { label: 'Weeks', value: 2 },
      { label: 'Months', value: 3 }
    ]
    const renderSelect = computed(() => (
      <USelect
        class="w-30 text-center"
        options={periodOptions}
        v-model:value={props.bountyInfo.period.periodType}
      />
    ))
    const payPeriodTotal = computed(() => {
      return {
        usdcTotal: props.bountyInfo.period.periodAmount * props.bountyInfo.period.token1Amount,
        tokenTotal: props.bountyInfo.period.periodAmount * props.bountyInfo.period.token2Amount
      }
    })
    const payDetailPeriodFields: FormFactoryField[] = [
      {
        t: 'custom',
        title: 'Work time planning',
        name: 'period',
        render(value) {
          return (
            <div class="w-full">
              <div class="flex items-center">
                <UInputNumberGroup
                  inputProps={{
                    precision: 0,
                    min: 2
                  }}
                  v-model:value={props.bountyInfo.period.periodAmount}
                  class="flex-1"
                  type="withSelect"
                  renderSelect={() => renderSelect.value}
                ></UInputNumberGroup>
                <div class="text-grey2 text-3xl px-5 invisible">+</div>
                <UInputNumberGroup
                  inputProps={{
                    precision: 0,
                    min: 1,
                    max: 24
                  }}
                  v-model:value={props.bountyInfo.period.hoursPerDay}
                  class="flex-1"
                  type="withUnit"
                  renderUnit={() => renderUnit('hours/Day')}
                ></UInputNumberGroup>
              </div>
            </div>
          )
        }
      },
      {
        t: 'custom',
        title: 'Rewards (once)',
        name: 'rewards',
        render(value) {
          return (
            <div class="flex items-start w-full">
              <UInputNumberGroup
                class="flex-1"
                type="withUnit"
                v-model:value={props.bountyInfo.period.token1Amount}
                inputProps={{
                  precision: 0,
                  min: 0,
                  max: MAX_AMOUNT,
                  class: 'flex-1',
                  parse: (value: string) => {
                    if (value === null) return 0
                    return Number(value)
                  }
                }}
                renderUnit={() => renderUnit(props.bountyInfo.token1Symbol)}
              ></UInputNumberGroup>
              <div class="text-grey2 text-3xl px-5">+</div>
              <div class="flex-1">
                <UInputNumberGroup
                  class="flex-1"
                  type="withUnit"
                  v-model:value={props.bountyInfo.period.token2Amount}
                  inputProps={{
                    precision: 0,
                    min: 0,
                    max: MAX_AMOUNT,
                    class: 'flex-1',
                    parse: (value: string) => {
                      if (value === null) return 0
                      return Number(value)
                    }
                  }}
                  renderUnit={() => renderUnit(props.bountyInfo.token2Symbol)}
                ></UInputNumberGroup>
                <div>
                  {!props.bountyInfo.token2Symbol && (
                    <div class="text-grey4 text-xs col-start-3 mt-2">
                      Not setup token yet, go to{' '}
                      <span
                        class="text-primary cursor-pointer"
                        onClick={() => ctx.emit('showLeaveTipModal', 'toFinanceSetting')}
                      >
                        Finance Setting
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        }
      },
      {
        t: 'custom',
        title: '',
        // slots: {
        //   label: () => [<div class="h-4"></div>]
        // },
        class: '!grid-rows-none',
        name: 'summary',
        render() {
          return (
            <div class="bg-purple py-5.5 px-6 w-full mt-4">
              The current total rewards as{' '}
              <span class="text-primary">
                <span class={[{ 'text-error': payPeriodTotal.value.usdcTotal > MAX_AMOUNT }]}>
                  {payPeriodTotal.value.usdcTotal} {props.bountyInfo.token1Symbol}{' '}
                </span>
                {props.bountyInfo.token2Symbol && (
                  <span>
                    {' '}
                    +{' '}
                    <span class={[{ 'text-error': payPeriodTotal.value.tokenTotal > MAX_AMOUNT }]}>
                      {payPeriodTotal.value.tokenTotal} {props.bountyInfo.token2Symbol}
                    </span>
                  </span>
                )}
              </span>
            </div>
          )
        }
      },
      {
        t: 'custom',
        title: 'Target',
        name: 'period.target',
        // required: true,
        rules: [
          { required: true, message: 'Please input description and target of bounty for applicant' }
        ],
        render() {
          return (
            <RichEditor
              placeholder="Set up description and target of bounty for applicant"
              class="w-full"
              v-model:value={props.bountyInfo.period.target}
            />
          )
        }
      }
    ]
    const payPeriodRules = getFieldsRules(payDetailPeriodFields)
    ctx.expose({
      payPeriodForm,
      payPeriodTotal
    })
    return {
      payDetailPeriodFields,
      payPeriodRules,
      payPeriodForm
    }
  },
  render() {
    return (
      <UForm
        class="mt-9"
        model={this.bountyInfo}
        rules={this.payPeriodRules}
        ref={(ref: any) => (this.payPeriodForm = ref)}
      >
        <UFormItemsFactory fields={this.payDetailPeriodFields} values={this.bountyInfo} />
      </UForm>
    )
  }
})

export default PayDetailPeriod
