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
  UModal
} from '@comunion/components'
import { defineComponent, Ref, computed, h, ref, reactive, watchEffect } from 'vue'
import { MAX_AMOUNT, renderUnit } from '@/blocks/Bounty/components/BasicInfo'
import { services } from '@/services'
import { useBountyStore } from '@/stores'

type checkboxItem = {
  value: boolean
  validate: boolean
}

const ApplyDialog = defineComponent({
  props: {
    visible: {
      type: Boolean,
      require: true
    },
    title: {
      type: String,
      require: true
    },
    deposit: {
      type: Number,
      require: true
    }
  },
  emits: ['triggerDialog'],
  setup(props) {
    const formData = reactive({
      deposit: 0,
      description: ''
    })
    watchEffect(() => {
      formData.deposit = props.deposit || 0
    })
    const fields: Ref<FormFactoryField[]> = computed(() => [
      {
        t: 'custom',
        name: 'deposit',
        title: '1. Deposit.',
        formItemProps: {
          feedback: `Minimum deposit ${formData.deposit} USDC for applying bounty`,
          themeOverrides: {
            feedbackTextColor: 'var(--u-grey-4-color)',
            feedbackFontSizeMedium: '12px'
          }
        },
        rules: [
          {
            required: true,
            validator: (rule, value: number) => {
              return value >= formData.deposit
            },
            message: `Minimum deposit ${formData.deposit} USDC for applying bounty`,
            trigger: 'blur'
          }
        ],
        slots: {
          label: () => [
            h(
              <div>
                Applicants deposit
                <span class="text-xs text-grey4 ml-4">
                  Applicant must deposit usdc for applying the bounty
                </span>
              </div>
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
              renderUnit={() => renderUnit('USDC')}
            />
          )
        }
      },
      {
        t: 'string',
        title: '2.Submit your executing plan.',
        name: 'description',
        required: true,
        type: 'textarea',
        placeholder: 'Input your execution plan',
        minlength: 30,
        rules: [
          { min: 30, message: 'At least more than 30 characters', required: true },
          { max: 1000, message: 'No more than 1000 characters', required: true }
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
      return `text-14px ${terms.validate ? 'text-error' : 'text-grey1'}`
    })

    const acceptClass = computed(() => {
      return `text-14px ${accept.validate ? 'text-error' : 'text-grey1'}`
    })

    const bountyStore = useBountyStore()

    const { getApplicants } = bountyStore

    return {
      fields,
      applyFields,
      form,
      terms,
      accept,
      termsClass,
      acceptClass,
      formData,
      getApplicants
    }
  },
  render() {
    const handleTerms = (e: any) => {
      e.stopPropagation()
      // console.log(e)
    }

    const triggerDialog = (done: boolean) => {
      this.$emit('triggerDialog', done)
    }

    const userBehavier = (type: 'submit' | 'cancel') => () => {
      if (type === 'cancel') {
        triggerDialog(false)
        return
      }
      this.form?.validate(err => {
        if (typeof err === 'undefined' && this.terms.value && this.accept.value) {
          services['bounty@bounty-applicants-deposit']({
            applicants: {
              bountyID: parseInt(this.$route.query.bountyId as string),
              description: this.formData.description
            },
            applicantsDeposit: {
              // chainID: 0,
              // txHash: '',
              tokenSymbol: '',
              tokenAmount: this.formData.deposit
            }
          })
          this.getApplicants(this.$route.query.bountyId as string)
          triggerDialog(true)
        }
        if (!this.terms.value) {
          this.terms.validate = true
        }
        if (!this.accept.value) {
          this.accept.validate = true
        }
        console.log(err)
      })
    }

    const handleCheckbox = (type: 'terms' | 'accept') => (checked: boolean) => {
      this[type].value = checked
      if (checked) {
        this[type].validate = false
      }
    }

    return (
      <UModal show={this.visible}>
        <UCard
          style="width: 600px"
          title={this.title}
          bordered={false}
          size="huge"
          role="dialog"
          aria-modal="true"
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
                <a class="text-primary" onClick={handleTerms}>
                  the Terms of Service.
                </a>
              </span>
            </UCheckbox>
            <br />
            <UCheckbox
              checked={this.accept.value}
              onChange={handleCheckbox('accept')}
              class="mt-10px"
            >
              <span class={this.acceptClass}>
                I accept that I will not be able to take the deposit in case of evil.
              </span>
            </UCheckbox>
            <div class="flex justify-end mt-40px">
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

export default ApplyDialog
