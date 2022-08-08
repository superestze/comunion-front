import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UButton,
  UForm,
  UFormItemsFactory
} from '@comunion/components'
import { defineComponent, ref, reactive, PropType, watch } from 'vue'

type SecurityType = {
  kyc: string
  contractAudit: string
}

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<SecurityType>,
      required: true
    }
  },
  setup(props) {
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
      fields,
      form,
      info
    }
  },
  render() {
    const handleSubmit = () => {
      this.form?.validate(err => {
        console.log(err)
      })
    }

    const rules = getFieldsRules(this.fields)
    return (
      <div class="bg-white rounded-lg border mb-6 relative overflow-hidden">
        <div class="mx-10 my-9.5">
          <UForm rules={rules} model={this.info} ref={(ref: any) => (this.form = ref)}>
            <UFormItemsFactory fields={this.fields} values={this.info} />
          </UForm>
          <UButton class="w-30" type="primary" size="small" onClick={handleSubmit}>
            Save
          </UButton>
        </div>
      </div>
    )
  }
})
