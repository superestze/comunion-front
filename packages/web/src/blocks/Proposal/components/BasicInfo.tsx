import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UForm,
  UFormItemsFactory
} from '@comunion/components'
import { computed, defineComponent, PropType, ref, Ref, watch } from 'vue'
import { ProposalInfo } from '../typing'
import RichEditor from '@/components/Editor'

export interface ProposalBasicInformationRef {
  proposalBasicInfoForm: FormInst | null
}

export const BasicInfo = defineComponent({
  name: 'BasicInfo',
  props: {
    proposalInfo: {
      type: Object as PropType<ProposalInfo>,
      required: true
    }
  },
  setup(props) {
    const descriptionField = ref()
    const proposalBasicInfoForm = ref<FormInst | null>(null)
    watch(
      () => props.proposalInfo.description,
      () => {
        descriptionField.value?.validate()
      }
    )
    const formFields: Ref<FormFactoryField[]> = computed(() => [
      {
        t: 'select',
        title: 'Startup',
        name: 'startup',
        required: true,
        placeholder: 'Please select a startup',
        options: []
      },
      {
        t: 'string',
        title: 'Title',
        name: 'title',
        rules: [{ required: true, message: 'Title cannot be blank', trigger: 'blur' }],
        placeholder: 'Title',
        maxlength: 64
      },
      {
        t: 'custom',
        title: 'Description',
        name: 'description',
        formItemProps: {
          ref: (value: any) => (descriptionField.value = value),
          first: true
        },
        rules: [
          {
            validator: (rule, value) => {
              return value && value.replace(/<.>|<\/.>/g, '').length > 64
            },
            message: 'Description must be 64 characters or more',
            trigger: 'blur'
          }
        ],
        render() {
          return (
            <RichEditor
              limit={6400}
              placeholder="Describe what you Proposal is about"
              class="w-full"
              v-model:value={props.proposalInfo.description}
            />
          )
        }
      },
      {
        t: 'string',
        title: 'Discussion',
        name: 'discussion',
        placeholder: 'https://',
        maxlength: 200
      }
    ])
    const proposalBasicInfoRules = getFieldsRules(formFields.value)

    const getStartups = async () => {
      try {
        // const { error, data } = await services['']
      } catch (error) {
        console.error('error===>', error)
      }
    }
    return {
      formFields,
      proposalBasicInfoForm,
      proposalBasicInfoRules
    }
  },
  render() {
    return (
      <div>
        <UForm
          ref={(ref: any) => (this.proposalBasicInfoForm = ref)}
          rules={this.proposalBasicInfoRules}
          model={this.proposalInfo}
          // class="grid grid-cols-2 gap-x-10"
        >
          <UFormItemsFactory fields={this.formFields} values={this.proposalInfo} />
        </UForm>
      </div>
    )
  }
})
