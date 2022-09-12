import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UForm,
  UFormItemsFactory
} from '@comunion/components'
import { SelectOption } from '@comunion/components/src/constants'
import { computed, defineComponent, PropType, ref, Ref } from 'vue'
import { ProposalInfo } from '../typing'
import RichEditor from '@/components/Editor'

export interface ProposalBasicInformationRef {
  proposalBasicInfoForm: FormInst | null
}

export const BasicInfo = defineComponent({
  name: 'BasicInfo',
  props: {
    startupOptions: {
      type: Array as PropType<SelectOption[]>,
      required: true
    },
    proposalInfo: {
      type: Object as PropType<ProposalInfo>,
      required: true
    }
  },
  setup(props, ctx) {
    const proposalBasicInfoForm = ref<FormInst | null>(null)

    const formFields: Ref<FormFactoryField[]> = computed(() => [
      {
        t: 'select',
        title: 'Startup',
        name: 'startupId',
        placeholder: 'Please select a startup',
        rules: [
          { required: true, message: ' Please select a startup', type: 'number', trigger: 'blur' }
        ],
        options: props.startupOptions
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
          first: true
        },
        render() {
          return (
            <RichEditor
              limit={6400}
              placeholder="Describe what you proposal is about"
              class="w-full h-70"
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

    ctx.expose({
      proposalBasicInfoForm
    })
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
