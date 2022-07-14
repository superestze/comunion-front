import {
  FormFactoryField,
  getFieldsRules,
  UButton,
  UCard,
  UForm,
  UFormItemsFactory,
  UInputNumberGroup,
  UModal
} from '@comunion/components'
import { defineComponent, Ref, computed, PropType, h } from 'vue'
import { MAX_AMOUNT, renderUnit } from '@/blocks/Bounty/components/BasicInfo'

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      require: true
    },
    paymentInfo: {
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

    const payFields: Ref<FormFactoryField[]> = computed(() => [
      {
        t: 'custom',
        name: 'applicantsDeposit',
        title: 'Applicants deposit',
        formItemProps: {
          feedback: 'The maximal deposit amount is 9999USDC',
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
              v-model:value={props.paymentInfo.applicantsDeposit}
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
        t: 'website',
        title: 'Discussion link',
        name: 'discussionLink',
        maxlength: 200,
        placeholder: 'Discussion link'
      }
    ])
    const paymentFields = getFieldsRules(payFields.value)
    return {
      paymentFields,
      payFields,
      userBehavier
    }
  },
  render() {
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
            <UForm rules={this.paymentFields} model={this.paymentInfo}>
              <UFormItemsFactory fields={this.payFields} values={this.paymentInfo} />
            </UForm>
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
