import {
  FormFactoryField,
  FormInst,
  UCheckbox,
  UForm,
  UFormItemsFactory
} from '@comunion/components'
import { defineComponent, h, PropType, ref } from 'vue'
import { BountyInfo } from '../typing'
import { MAX_AMOUNT, renderUnit } from './BasicInfo'
import InputNumberGroup from '@/components/UInputNumberGroup'

export interface DepositRef {
  depositForm: FormInst | null
}

const Deposit = defineComponent({
  name: 'Deposit',
  props: {
    bountyInfo: {
      type: Object as PropType<BountyInfo>,
      required: true
    }
  },
  setup(props, ctx) {
    const depositForm = ref<FormInst | null>(null)
    const depositFields: FormFactoryField[] = [
      {
        t: 'custom',
        name: 'deposit',
        title: 'Deposit',
        slots: {
          label: () => [
            h(
              <div>
                Deposit
                <span class="n-form-item-label__asterisk">&nbsp;*</span>
                <span class="text-xs u-body1 text-grey4 ml-4">
                  Depoist usdc into bounty contract which can enhance credit in order to attract
                  much more applicants
                </span>
              </div>
            )
          ]
        },
        render(value) {
          return (
            <InputNumberGroup
              v-model:value={props.bountyInfo.deposit}
              class="flex-1"
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
              type="withUnit"
              renderUnit={() => renderUnit(props.bountyInfo.token1Symbol)}
            ></InputNumberGroup>
          )
        }
      },
      {
        t: 'custom',
        name: 'agreement',
        title: '',
        render(value) {
          return (
            <div class="flex items-center mt-4.5">
              <UCheckbox
                label="I have read, understand, and agree to, "
                v-model:checked={props.bountyInfo.agreement}
              />
              <span class="text-primary cursor-pointer">the Terms of Service.</span>
            </div>
          )
        }
      }
    ]
    ctx.expose({
      depositForm
    })
    return {
      depositForm,
      depositFields
    }
  },
  render() {
    return (
      <UForm
        model={this.bountyInfo}
        ref={(ref: any) => (this.depositForm = ref)}
        class="deposit-form"
      >
        <UFormItemsFactory fields={this.depositFields} values={this.bountyInfo} />
      </UForm>
    )
  }
})

export default Deposit
