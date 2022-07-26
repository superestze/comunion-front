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
import { defineComponent, Ref, computed, ref, reactive, PropType, watchEffect } from 'vue'
import { BountyProjectCardType } from '../ProjectCard'
import { MAX_AMOUNT, renderUnit } from '@/blocks/Bounty/components/BasicInfo'
import { services } from '@/services'
import { useBountyStore } from '@/stores'

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      require: true
    },
    paymentInfo: {
      type: Object as PropType<BountyProjectCardType>,
      require: true
    }
  },
  emits: ['triggerDialog'],
  setup(props) {
    const formData = reactive({
      token1Symbol: '',
      token2Symbol: '',
      token1Amount: 0,
      token2Amount: 0,
      transactionHash: ''
    })
    watchEffect(() => {
      formData.token1Symbol = props.paymentInfo?.token1Symbol || ''
      formData.token2Symbol = props.paymentInfo?.token2Symbol || ''
      formData.token1Amount = props.paymentInfo?.token1Amount || 0
      formData.token2Amount = props.paymentInfo?.token2Amount || 0
    })

    const fields: Ref<FormFactoryField[]> = computed(() => {
      const result: FormFactoryField[] = []
      if (formData.token1Symbol) {
        result.push({
          t: 'custom',
          name: 'token1Amount',
          title: 'Pay amount',
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
                return value > 0 || (formData.token2Amount > 0 && value >= 0)
              },
              trigger: 'blur'
            }
          ],
          render() {
            return (
              <UInputNumberGroup
                v-model:value={formData.token1Amount}
                type="withUnit"
                class="w-full"
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
                renderUnit={() => renderUnit(formData.token1Symbol)}
              />
            )
          }
        })
      }
      if (formData.token2Symbol) {
        result.push({
          t: 'custom',
          name: 'token2Amount',
          title: '',
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
                return value > 0 || (formData.token1Amount > 0 && value >= 0)
              },
              trigger: 'blur'
            }
          ],
          render() {
            return (
              <UInputNumberGroup
                v-model:value={formData.token1Amount}
                type="withUnit"
                class="w-full"
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
                renderUnit={() => renderUnit(formData.token1Symbol)}
              />
            )
          }
        })
      }
      result.push({
        title: 'Transaction hash',
        name: 'transactionHash',
        required: true,
        placeholder: 'Transaction hash'
      })
      return result
    })
    const payFields = getFieldsRules(fields.value)
    const form = ref<FormInst>()
    const bountyStore = useBountyStore()
    const { getActivities, getBountyPayment } = bountyStore
    return {
      payFields,
      fields,
      form,
      formData,
      getActivities,
      getBountyPayment
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
          const { error: errorPaid } = await services['bounty@bounty-paid-status']({
            bountyID: parseInt(this.$route.query.bountyId as string),
            seqNum: this.paymentInfo?.seqNum
          })
          const { error } = await services['bounty@bounty-activities']({
            bountyID: parseInt(this.$route.query.bountyId as string),
            content: JSON.stringify(this.formData),
            sourceType: 2
          })
          if (!errorPaid && !error) {
            this.getActivities(this.$route.query.bountyId as string)
            this.getBountyPayment(this.$route.query.bountyId as string)
            triggerDialog()
          }
        }
      })
    }
    return (
      <UModal show={this.visible}>
        <UCard
          style="width: 600px"
          title="Pay"
          bordered={false}
          size="huge"
          role="dialog"
          aria-modal="true"
          closable
          onClose={triggerDialog}
        >
          <>
            <UForm
              rules={this.payFields}
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
