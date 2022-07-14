import {
  FormFactoryField,
  getFieldsRules,
  UButton,
  UCard,
  UForm,
  UFormItemsFactory,
  UModal
} from '@comunion/components'
import { defineComponent, Ref, computed, reactive } from 'vue'
import RichEditor from '@/components/Editor'

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
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

    const info = reactive({
      update: ''
    })
    const fields: Ref<FormFactoryField[]> = computed(() => [
      {
        t: 'custom',
        title: 'Description',
        name: 'update',
        rules: [{ required: true, message: 'Describe the details of the bounty' }],
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
    return {
      postUpdateFields,
      fields,
      userBehavier,
      info
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
            <UForm rules={this.postUpdateFields} model={this.info}>
              <UFormItemsFactory fields={this.fields} values={this.info} />
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
