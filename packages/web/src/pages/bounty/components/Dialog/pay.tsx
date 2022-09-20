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
import { defineComponent, Ref, computed, ref, reactive, PropType, watch } from 'vue'
import { useRoute } from 'vue-router'
import { BountyProjectCardType } from '../ProjectCard'
import { MAX_AMOUNT, renderUnit } from '@/blocks/Bounty/components/BasicInfo'
import { services } from '@/services'
import { useBountyStore } from '@/stores'
import { checkSupportNetwork } from '@/utils/wallet'

import './pay.css'

type paidInfoType = {
  tokenSymbol: string
  tokenAmount: number
  txHash: string
}

export default defineComponent({
  name: 'PayDailog',
  props: {
    visible: {
      type: Boolean,
      require: true
    },
    paymentInfo: {
      type: Object as PropType<BountyProjectCardType>,
      require: true
    },
    detailChainId: {
      type: Number,
      default: () => 0
    }
  },
  emits: ['triggerDialog'],
  setup(props) {
    const route = useRoute()
    const formData = reactive({
      token1Symbol: '',
      token2Symbol: '',
      token1Amount: 0,
      token2Amount: 0,
      transactionHash1: '',
      transactionHash2: ''
    })
    watch(
      () => props.visible,
      value => {
        if (value) {
          formData.token1Symbol = props.paymentInfo?.token1Symbol || ''
          formData.token2Symbol = props.paymentInfo?.token2Symbol || ''
          formData.token1Amount = props.paymentInfo?.token1Amount || 0
          formData.token2Amount = props.paymentInfo?.token2Amount || 0
          formData.transactionHash1 = ''
          formData.transactionHash2 = ''
        }
      }
    )

    const fields: Ref<FormFactoryField[]> = computed(() => {
      const result: FormFactoryField[] = []
      if (formData.token1Symbol) {
        result.push({
          t: 'custom',
          name: 'token1Amount',
          title: 'Pay amount',
          // required: true,
          rules: [
            {
              required: true,
              message: 'Pay amount cannot be blank',
              type: 'number',
              trigger: 'blur'
            },
            {
              validator: (rule, value) => {
                return value > 0 || (formData.token2Amount > 0 && value >= 0)
              },
              message: 'At least greater than 0 for pay amount',
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
            feedback: 'At least greater than 0 for pay amount',
            themeOverrides: {
              feedbackTextColor: 'var(--u-grey-4-color)',
              feedbackFontSizeMedium: '12px'
            }
          },
          rules: [
            {
              validator: (rule, value) => {
                return value > 0 || (formData.token1Amount > 0 && value >= 0)
              },
              message: 'Please set pay amount',
              trigger: 'blur'
            }
          ],
          render() {
            return (
              <UInputNumberGroup
                v-model:value={formData.token2Amount}
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
                renderUnit={() => renderUnit(formData.token2Symbol)}
              />
            )
          }
        })
      }
      if (formData.token1Symbol) {
        result.push({
          title: 'Transaction Hash',
          name: 'transactionHash1',
          required: true,
          placeholder: 'Transaction Hash',
          rules: [
            {
              validator: (rule, value: string) => {
                return !value || /^0x([A-Fa-f0-9]{64})$/.test(value)
              },
              message: 'Transaction Hash incorrect',
              trigger: 'blur'
            }
          ]
        })
      }
      if (formData.token2Symbol) {
        result.push({
          title: `${formData.token2Symbol} Transaction Hash`,
          name: 'transactionHash2',
          required: true,
          placeholder: 'Transaction Hash',
          rules: [
            {
              validator: (rule, value: string) => {
                return !value || /^0x([A-Fa-f0-9]{64})$/.test(value)
              },
              message: 'Transaction Hash incorrect',
              trigger: 'blur'
            }
          ]
        })
      }

      return result
    })
    const payFields = computed(() => {
      const p = getFieldsRules(fields.value)
      console.log(p)
      // return p
      return p
    })
    const form = ref<FormInst>()
    const bountyStore = useBountyStore()
    const { getActivities, getBountyPayment } = bountyStore

    const paidInfo = computed(() => {
      const result: paidInfoType[] = []
      if (formData.token1Symbol) {
        const tokenAmount = Number(formData.token1Amount) || 0
        result.push({
          tokenSymbol: formData.token1Symbol,
          tokenAmount: tokenAmount,
          txHash: formData.transactionHash1
        })
      }
      if (formData.token2Symbol) {
        const tokenAmount = Number(formData.token2Amount) || 0
        result.push({
          tokenSymbol: formData.token2Symbol,
          tokenAmount: tokenAmount,
          txHash: formData.transactionHash2
        })
      }
      return result
    })
    return {
      payFields,
      fields,
      form,
      formData,
      getActivities,
      getBountyPayment,
      paidInfo,
      route
    }
  },
  render() {
    const triggerDialog = () => {
      this.$emit('triggerDialog')
    }

    const userBehavier = (type: 'submit' | 'cancel') => async () => {
      if (type === 'cancel') {
        triggerDialog()
        return
      }
      const isSupport = await checkSupportNetwork(this.detailChainId)
      if (!isSupport) {
        return
      }
      this.form?.validate(async err => {
        if (typeof err === 'undefined') {
          const { error: errorPaid } = await services['bounty@bounty-paid']({
            bountyID: parseInt(this.route.params.id as string),
            seqNum: this.paymentInfo?.seqNum || 0,
            paidInfo: this.paidInfo
          })
          const { error } = await services['bounty@bounty-activities']({
            bountyID: this.route.params.id as string,
            content: JSON.stringify(this.formData),
            sourceType: 2
          })
          if (!errorPaid && !error) {
            this.getActivities(this.route.params.id as string)
            this.getBountyPayment(this.route.params.id as string)
            triggerDialog()
          }
        }
      })
    }
    return (
      <UModal show={this.visible}>
        <UCard
          style={{
            width: '600px',
            '--n-title-text-color': '#000000',
            '--n-close-icon-color': '#5331F4'
          }}
          title="Payment"
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
                Cancel
              </UButton>
              <UButton class="w-164px" type="primary" onClick={userBehavier('submit')}>
                Submit
              </UButton>
            </div>
          </>
        </UCard>
      </UModal>
    )
  }
})
