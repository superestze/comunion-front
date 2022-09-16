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
import { useBountyStore } from '@/stores'
import { useContractStore } from '@/stores/contract'
import { checkSupportNetwork } from '@/utils/wallet'

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      require: true
    },
    detailChainId: {
      type: Number,
      default: () => 0
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
              // console.log(formData.increaseDeposit)
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

    const bountyStore = useBountyStore()

    const { detail } = bountyStore
    const { deposit } = bountyContract
    return {
      addDepositFields,
      fields,
      form,
      formData,
      deposit,
      approve,
      chainId,
      detail
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
          const approvePendingText =
            'Waiting to submit all contents to blockchain for approval deposit'
          const contractStore = useContractStore()
          contractStore.startContract(approvePendingText)
          const tokenSymbol = 'USDC'
          await this.approve(
            this.detail?.depositContract || '',
            ethers.utils.parseUnits((this.formData.increaseDeposit || '').toString(), 18)
          )
          const response = (await this.deposit(
            ethers.utils.parseUnits(this.formData.increaseDeposit || '', 18),
            'Waiting to submit all contents to blockchain for increase deposit',
            `Deposit increased by ${this.formData.increaseDeposit} ${tokenSymbol}`
          )) as unknown as BountyContractReturnType
          const tokenAmount = Number(this.formData.increaseDeposit)
          const { error } = await services['bounty@bounty-add-deposit']({
            bountyID: this.$route.query.bountyId as string,
            chainID: this.chainId,
            txHash: response.hash,
            tokenSymbol: tokenSymbol,
            tokenAmount: tokenAmount || 0
          })

          const bountyStore = useBountyStore()
          bountyStore.initialize(this.$route.query.bountyId as string)
          if (!error) {
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
            '--n-title-text-color': '#3F2D99',
            '--n-close-icon-color': '#3F2D99'
          }}
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
