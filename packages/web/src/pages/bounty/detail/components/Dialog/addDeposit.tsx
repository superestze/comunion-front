import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UButton,
  UCard,
  UForm,
  UFormItemsFactory,
  UInputNumberGroup,
  UModal
} from '@comunion/components'
import { ethers } from 'ethers'
import { defineComponent, Ref, computed, ref, reactive, watch } from 'vue'
import {
  useBountyContractWrapper,
  BountyContractReturnType
} from '../../hooks/useBountyContractWrapper'
import { MAX_AMOUNT, renderUnit } from '@/blocks/Bounty/components/BasicInfo'
import { services } from '@/services'

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      require: true
    }
  },
  emits: ['triggerDialog'],
  setup(props) {
    const formData = reactive({
      increaseDeposit: null
    })

    watch(
      () => props.visible,
      value => {
        if (value) {
          formData.increaseDeposit = null
        }
      }
    )

    const fields: Ref<FormFactoryField[]> = computed(() => [
      {
        t: 'custom',
        name: 'increaseDeposit',
        title: 'Increase amount of deposit to enhance credit',
        formItemProps: {
          feedback: 'At least greater than 0 for new desposit',
          themeOverrides: {
            feedbackTextColor: 'var(--u-grey-4-color)',
            feedbackFontSizeMedium: '12px'
          }
        },
        rules: [
          {
            required: true,
            validator: (rule, value: number) => {
              console.log(formData.increaseDeposit)
              return value > 0
            },
            trigger: 'change'
          }
        ],
        render() {
          return (
            <UInputNumberGroup
              v-model:value={formData.increaseDeposit}
              type="withUnit"
              class="w-full"
              inputProps={{
                precision: 0,
                min: 0,
                max: MAX_AMOUNT,
                class: 'flex-1',
                parse: (value: string) => {
                  if (value === null || value === '') return 0
                  return Number(value)
                }
              }}
              renderUnit={() => renderUnit('USDC')}
            />
          )
        }
      }
    ])
    const addDepositFields = getFieldsRules(fields.value)
    const form = ref<FormInst>()

    const { bountyContract, approve, chainId } = useBountyContractWrapper()
    const { deposit } = bountyContract
    return {
      addDepositFields,
      fields,
      form,
      formData,
      deposit,
      approve,
      chainId
    }
  },
  render() {
    const triggerDialog = () => {
      this.$emit('triggerDialog')
    }

    const userBehavier = (type: 'submit' | 'cancel') => () => {
      if (type === 'cancel') {
        triggerDialog()
        return
      }
      this.form?.validate(async err => {
        if (typeof err === 'undefined') {
          await this.approve(
            '0x11FF42b0cBAC4E5DE2bC0C9B973F40790a40A17a',
            ethers.utils.parseUnits((this.formData.increaseDeposit || '').toString(), 18)
          )
          const response = (await this.deposit(
            ethers.utils.parseUnits(this.formData.increaseDeposit || '', 18),
            '',
            ''
          )) as unknown as BountyContractReturnType
          const { error } = await services['bounty@bounty-add-deposit']({
            bountyID: this.$route.query.bountyId as string,
            chainID: this.chainId,
            txHash: response.hash,
            tokenSymbol: 'USDC',
            tokenAmount: this.formData.increaseDeposit as unknown as number
          })
          if (!error) {
            triggerDialog()
          }
        }
      })
    }
    return (
      <UModal show={this.visible}>
        <UCard
          style="width: 600px"
          title="Increase deposit"
          bordered={false}
          size="huge"
          role="dialog"
          aria-modal="true"
          closable
          onClose={triggerDialog}
        >
          <>
            <UForm
              class="mt-24px mb-40px"
              rules={this.addDepositFields}
              model={this.formData}
              ref={(ref: any) => (this.form = ref)}
            >
              <UFormItemsFactory fields={this.fields} values={this.formData} />
            </UForm>
            <div class="flex justify-end">
              <UButton class="mr-16px w-164px" type="default" onClick={userBehavier('cancel')}>
                cancel
              </UButton>
              <UButton class="w-164px" type="primary" onClick={userBehavier('submit')}>
                submit
              </UButton>
            </div>
          </>
        </UCard>
      </UModal>
    )
  }
})
