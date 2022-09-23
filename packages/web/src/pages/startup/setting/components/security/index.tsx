import {
  USpin,
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UButton,
  UForm,
  UFormItemsFactory,
  message
} from '@comunion/components'
import { defineComponent, ref, reactive, PropType, watch } from 'vue'
import { services } from '@/services'

type SecurityType = {
  kyc: string
  contractAudit: string
}

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<SecurityType>,
      required: true
    },
    startupId: {
      type: String,
      required: true
    }
  },
  emits: ['saved'],
  setup(props) {
    const loading = ref(false)

    const info = reactive({
      kyc: props.data.kyc || '',
      contractAudit: props.data.contractAudit || ''
    })
    watch(
      () => props.data,
      data => {
        info.kyc = data.kyc
        info.contractAudit = data.contractAudit
      }
    )
    const fields: FormFactoryField[] = [
      {
        t: 'string',
        title: 'KYC',
        name: 'kyc',
        placeholder: 'Input startup KYC',
        rules: [
          {
            validator: (rule, value) =>
              !value ||
              (value && value.startsWith('https://')) ||
              (value && value.startsWith('http://')),
            message: 'Invalid URL',
            trigger: 'blur'
          }
        ],
        onBlur: (e: Event) => {
          const oIpt = e.target as HTMLTextAreaElement
          if (!oIpt!.className.includes('truncate')) {
            oIpt!.className = oIpt!.className + ' ' + 'truncate'
          }
        }
      },
      {
        t: 'string',
        title: 'Contract Audit',
        name: 'contractAudit',
        placeholder: 'Input startup contract audit',
        rules: [
          {
            validator: (rule, value) =>
              !value ||
              (value && value.startsWith('https://')) ||
              (value && value.startsWith('http://')),
            message: 'Invalid URL',
            trigger: 'blur'
          }
        ],
        onBlur: (e: Event) => {
          const oIpt = e.target as HTMLTextAreaElement
          if (!oIpt!.className.includes('truncate')) {
            oIpt!.className = oIpt!.className + ' ' + 'truncate'
          }
        }
      }
    ]
    const form = ref<FormInst>()

    return {
      loading,
      fields,
      form,
      info
    }
  },
  render() {
    const handleSubmit = () => {
      this.form?.validate(async err => {
        if (!err) {
          // loadding
          this.loading = true
          await services['startup@update-security']({
            startupID: this.startupId,
            kyc: this.info.kyc,
            contractAudit: this.info.contractAudit
          })
          this.loading = false
          message.success('Successfully saved')
          this.$emit('saved')
        }
      })
    }

    const rules = getFieldsRules(this.fields)
    return (
      <USpin show={this.loading}>
        <div class="bg-white border rounded-sm mb-6 min-h-200 p-10 relative overflow-hidden">
          <UForm rules={rules} model={this.info} ref={(ref: any) => (this.form = ref)}>
            <UFormItemsFactory fields={this.fields} values={this.info} />
          </UForm>
          <div class="flex mt-10 items-center justify-end">
            <UButton class="w-30" type="primary" size="small" onClick={handleSubmit}>
              Save
            </UButton>
          </div>
        </div>
      </USpin>
    )
  }
})
