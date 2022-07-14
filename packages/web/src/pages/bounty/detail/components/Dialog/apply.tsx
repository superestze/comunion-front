import {
  FormFactoryField,
  getFieldsRules,
  UButton,
  UCard,
  UCheckbox,
  UForm,
  UFormItemsFactory,
  UInputNumberGroup,
  UModal
} from '@comunion/components'
import { defineComponent, Ref, computed, h, PropType } from 'vue'
import { MAX_AMOUNT, renderUnit } from '@/blocks/Bounty/components/BasicInfo'

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      require: true
    },
    applyInfo: {
      type: Object as PropType<any>,
      require: true
    }
  },
  emits: ['triggerDialog'],
  setup(props, ctx) {
    const triggerDialog = () => {
      ctx.emit('triggerDialog')
    }

    const userBehavier = (type: 'submit' | 'cancel') => () => {
      if (type === 'cancel') {
        triggerDialog()
        return
      }
      triggerDialog()
    }

    const fields: Ref<FormFactoryField[]> = computed(() => [
      {
        t: 'custom',
        name: 'applicantsDeposit',
        title: '1. Deposit.',
        formItemProps: {
          feedback:
            'Minimum deposit 20 USDC for applying bounty,The maximal deposit amount is 9999USDC',
          themeOverrides: {
            feedbackTextColor: 'var(--u-grey-4-color)',
            feedbackFontSizeMedium: '12px'
          }
        },
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
              v-model:value={props.applyInfo.applicantsDeposit}
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
        title: '2.Submit your executing plan.',
        name: 'bio',
        required: true,
        type: 'textarea',
        placeholder: 'Input your execution plan',
        minlength: 100,
        rules: [{ min: 100, message: 'Tell us about yourself, at least 100 characters' }],
        // @ts-ignore
        autosize: {
          minRows: 5,
          maxRows: 10
        }
      }
      // {
      //   t: 'custom',
      //   name: 'test1',
      //   // title: '1. Deposit.',
      //   // formItemProps: {
      //   //   feedback:
      //   //     'Minimum deposit 20 USDC for applying bounty,The maximal deposit amount is 9999USDC',
      //   //   themeOverrides: {
      //   //     feedbackTextColor: 'var(--u-grey-4-color)',
      //   //     feedbackFontSizeMedium: '12px'
      //   //   }
      //   // },
      //   slots: {
      //     label: () => [h(<UCheckbox value="Option 1">Option 1231231</UCheckbox>)]
      //   },
      //   render() {
      //     return <UCheckbox value="Option 1">Option 1231231</UCheckbox>
      //   }
      // }
    ])
    const applyFields = getFieldsRules(fields.value)

    return {
      userBehavier,
      fields,
      applyFields
    }
  },
  render() {
    const handleTerms = (e: any) => {
      e.stopPropagation()
      // console.log(e)
    }
    return (
      <UModal show={this.visible}>
        <UCard
          style="width: 600px"
          title="Modal"
          bordered={false}
          size="huge"
          role="dialog"
          aria-modal="true"
          v-slots={{
            'header-extra': () => <h1>X</h1>
          }}
        >
          <>
            <UForm rules={this.applyFields} model={this.applyInfo}>
              <UFormItemsFactory fields={this.fields} values={this.applyInfo} />
            </UForm>
            <UCheckbox value="Option 1">
              <span class="text-14px text-grey1">
                I have read, understand, and agree to,{' '}
                <a class="text-primary" onClick={handleTerms}>
                  the Terms of Service.
                </a>
              </span>
            </UCheckbox>
            <br />
            <UCheckbox value="Option 1" class="mt-10px">
              <span class="text-14px text-grey1">
                I accept that I will not be able to take the deposit in case of evil.
              </span>
            </UCheckbox>
            <div class="flex justify-end">
              <UButton class="mr-16px w-164px" type="default" onClick={this.userBehavier('cancel')}>
                cancel
              </UButton>
              <UButton class="w-164px" type="primary" onClick={this.userBehavier('submit')}>
                submit
              </UButton>
            </div>
          </>
        </UCard>
      </UModal>
    )
  }
})
