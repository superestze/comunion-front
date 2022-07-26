import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UButton,
  UCard,
  UForm,
  UFormItemsFactory,
  UModal
} from '@comunion/components'
import { defineComponent, Ref, computed, reactive, ref } from 'vue'
import RichEditor from '@/components/Editor'
import { services } from '@/services'
import { useBountyStore } from '@/stores'

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      require: true
    }
  },
  emits: ['triggerDialog'],
  setup() {
    const info = reactive({
      update: ''
    })
    const fields: Ref<FormFactoryField[]> = computed(() => [
      {
        t: 'custom',
        title: 'This update will be shown on activity',
        name: 'update',
        formItemProps: {
          feedback: 'Please enter an update',
          themeOverrides: {
            feedbackTextColor: 'var(--u-grey-4-color)',
            feedbackFontSizeMedium: '12px'
          }
        },
        rules: [
          {
            required: true,
            validator: (rule, value: string) => {
              return value.trim() !== ''
            },
            trigger: 'blur'
          }
        ],
        render() {
          return (
            <RichEditor
              placeholder="Describe the details of the bounty"
              class="w-full"
              v-model:value={info.update}
            />
          )
        }
      }
    ])

    const postUpdateFields = getFieldsRules(fields.value)
    const form = ref<FormInst>()
    const bountyStore = useBountyStore()
    const { getActivities } = bountyStore
    return {
      postUpdateFields,
      fields,
      info,
      form,
      getActivities
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
      this.form?.validate(async err => {
        if (typeof err === 'undefined') {
          const { error } = await services['bounty@bounty-activities']({
            sourceType: 1,
            content: this.info.update,
            bountyID: this.$route.query.bountyId as string
          })
          if (!error) {
            this.getActivities(this.$route.query.bountyId as string)
            triggerDialog()
          }
        }
      })
    }
    return (
      <UModal show={this.visible}>
        <UCard
          style="width: 600px"
          title="Post update"
          bordered={false}
          size="huge"
          role="dialog"
          aria-modal="true"
          closable
          onClose={triggerDialog}
        >
          <>
            <UForm
              rules={this.postUpdateFields}
              model={this.info}
              ref={(ref: any) => (this.form = ref)}
              class="mb-25px mt-8px"
            >
              <UFormItemsFactory fields={this.fields} values={this.info} />
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
