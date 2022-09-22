import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UButton,
  UCard,
  UCheckbox,
  UForm,
  UFormItemsFactory,
  UInputNumberGroup,
  UModal,
  message
} from '@comunion/components'
import { ethers } from 'ethers'
import { defineComponent, Ref, computed, h, ref, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  BountyContractReturnType,
  useBountyContractWrapper
} from '../../hooks/useBountyContractWrapper'
import { MAX_AMOUNT, renderUnit } from '@/blocks/Bounty/components/BasicInfo'
import { services } from '@/services'
import { useBountyStore } from '@/stores'
import { useContractStore } from '@/stores/contract'
import { checkSupportNetwork } from '@/utils/wallet'
type checkboxItem = {
  value: boolean
  validate: boolean
}

const ApplyDialog = defineComponent({
  name: 'applyBountyDialog',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    deposit: {
      type: Number,
      required: true
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
      deposit: 0,
      description: ''
    })
    // Minimum deposit
    let deposit = 0

    watch(
      () => props.visible,
      value => {
        if (value) {
          formData.deposit = props.deposit || 0
          formData.description = ''
          if (!deposit) deposit = props.deposit || 0
        }
      }
    )

    const bountyStore = useBountyStore()

    const { detail } = bountyStore
    const { bountyContract, bountyContractStore, approve, chainId } = useBountyContractWrapper()
    const fields: Ref<FormFactoryField[]> = computed(() => [
      {
        t: 'custom',
        name: 'deposit',
        label: '1.Deposit',
        title: '1. Deposit',
        rules: [
          {
            required: true,
            validator: (rule, value: number) => {
              return value >= deposit
            },
            message: `Minimum deposit ${deposit} USDC for applying bounty`,
            trigger: 'blur'
          }
        ],
        slots: {
          label: () => [h(<div>1.Deposit</div>)],
          feedback: () => [
            h(
              <span class="text-color3 u-h7">
                Minimum deposit <span class="text-primary">{deposit}</span>{' '}
                {detail?.depositTokenSymbol} for applying bounty
              </span>
            )
          ]
        },
        render() {
          return (
            <UInputNumberGroup
              v-model:value={formData.deposit}
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
              renderUnit={() =>
                renderUnit(bountyContractStore.bountyContractInfo.depositTokenSymbol)
              }
            />
          )
        }
      },
      {
        t: 'string',
        title: '2.Submit your executing plan.',
        name: 'description',
        type: 'textarea',
        placeholder: 'Input your executing plan',
        minlength: 30,
        rules: [
          { required: true, message: `The executing plan can't be blank.` },
          { min: 30, message: 'At least more than 30 characters' },
          { max: 1000, message: 'No more than 1000 characters' }
        ],
        // @ts-ignore
        autosize: {
          minRows: 5,
          maxRows: 10
        }
      }
    ])
    const applyFields = getFieldsRules(fields.value)

    const form = ref<FormInst>()

    const terms = reactive<checkboxItem>({ value: false, validate: false })

    const accept = reactive<checkboxItem>({ value: false, validate: false })

    const termsClass = computed(() => {
      return `text-14px ${terms.validate ? 'text-error' : 'text-color1'}`
    })

    const acceptClass = computed(() => {
      return `text-14px ${accept.validate ? 'text-error' : 'text-color1'}`
    })

    return {
      fields,
      applyFields,
      form,
      terms,
      accept,
      termsClass,
      acceptClass,
      formData,
      bountyContract,
      approve,
      chainId,
      detail,
      bountyContractStore,
      route
    }
  },
  render() {
    const triggerDialog = (done: boolean) => {
      this.$emit('triggerDialog', done)
    }

    const userBehavier = (type: 'submit' | 'cancel') => async () => {
      if (type === 'cancel') {
        triggerDialog(false)
        return
      }
      const isSupport = await checkSupportNetwork(this.detailChainId)
      if (!isSupport) {
        return
      }
      this.form?.validate(async err => {
        if (typeof err === 'undefined' && this.terms.value && this.accept.value) {
          // console.log(ethers.utils.parseUnits(this.formData.deposit.toString(), 18))
          let response!: BountyContractReturnType
          const tokenSymbol = this.bountyContractStore.bountyContractInfo.depositTokenSymbol
          if (this.formData.deposit >= this.deposit) {
            const approvePendingText =
              'Waiting to submit all contents to blockchain for approval deposit'
            const contractStore = useContractStore()
            contractStore.startContract(approvePendingText)
            console.warn('bounty detail info', this.detail)

            const res1 = await this.approve(
              this.detail?.depositContract || '',
              ethers.utils.parseUnits(this.formData.deposit.toString(), 18)
            )
            console.warn('bounty detail 2', res1)
            if (!res1) {
              return triggerDialog(false)
            }
            response = (await this.bountyContract.applyFor(
              ethers.utils.parseUnits(this.formData.deposit.toString(), 18),
              'Waiting to submit all contents to blockchain for apply',
              `Apply by ${this.formData.deposit} ${tokenSymbol}`
            )) as unknown as BountyContractReturnType
            console.warn('bounty detail 3', response)
            if (!response) {
              message.error('支付失败')
              return triggerDialog(false)
            }
          } else {
            return message.error('Input deposit must be greater than applicant deposit!')
          }
          const tokenAmount = Number(this.formData.deposit)
          await services['bounty@bounty-applicants-apply']({
            bountyID: parseInt(this.route.params.id as string),
            applicants: {
              description: this.formData.description
            },
            applicantsDeposit: {
              chainID: this.chainId as number,
              txHash: response ? response.hash : '',
              tokenSymbol: tokenSymbol,
              tokenAmount: tokenAmount || 0
            }
          })

          const bountyStore = useBountyStore()
          bountyStore.initialize(this.route.params.id as string)
          return triggerDialog(true)
        }
        if (!this.terms.value) {
          this.terms.validate = true
        }
        if (!this.accept.value) {
          this.accept.validate = true
        }
        return console.log(err)
      })
    }

    const handleCheckbox = (type: 'terms' | 'accept') => (checked: boolean) => {
      this[type].value = checked
      if (checked) {
        this[type].validate = false
      }
    }

    return (
      <UModal v-model:show={this.visible}>
        <UCard
          style={{
            width: '540px',
            '--n-title-text-color': '#3F2D99'
          }}
          title={this.title}
          closable
          onClose={userBehavier('cancel')}
        >
          <>
            <UForm
              rules={this.applyFields}
              model={this.formData}
              ref={(ref: any) => (this.form = ref)}
            >
              <UFormItemsFactory fields={this.fields} values={this.formData} />
            </UForm>
            <UCheckbox checked={this.terms.value} onChange={handleCheckbox('terms')}>
              <span class={this.termsClass}>
                I have read, understand, and agree to,{' '}
                <a class="text-primary" href="###">
                  the Terms of Service.
                </a>
              </span>
            </UCheckbox>
            <br />
            <UCheckbox checked={this.accept.value} onChange={handleCheckbox('accept')} class="mt-2">
              <span class={this.acceptClass}>
                I accept that I will not be able to take the deposit in case of evil.
              </span>
            </UCheckbox>
            <div class="flex mt-10 justify-end">
              <UButton class="mr-4 w-40" type="default" onClick={userBehavier('cancel')}>
                Cancel
              </UButton>
              <UButton
                class="w-40"
                type="primary"
                onClick={userBehavier('submit')}
                disabled={!this.detail?.depositContract}
                loading={!this.detail?.depositContract}
              >
                Submit
              </UButton>
            </div>
          </>
        </UCard>
      </UModal>
    )
  }
})

export default ApplyDialog
