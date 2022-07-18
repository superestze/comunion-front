import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UForm,
  UFormItemsFactory,
  USingleImageFileUpload
} from '@comunion/components'
import { defineComponent, PropType, computed, Ref, ref } from 'vue'
import { CrowdfundingInfo } from '../typing'
import RichEditor from '@/components/Editor'

export const AdditionalInformation = defineComponent({
  name: 'AdditionalInformation',
  props: {
    crowdfundingInfo: {
      type: Object as PropType<CrowdfundingInfo>,
      required: true
    }
  },
  setup(props) {
    const additionalInfoForm = ref<FormInst | null>(null)
    const formFields: Ref<FormFactoryField[]> = computed(() => [
      {
        t: 'custom',
        title: 'Poster',
        name: 'poster',
        render() {
          return <USingleImageFileUpload placeholder="Update 3:2" />
        }
      },
      {
        t: 'website',
        title: 'Youtube',
        name: 'youtube',
        maxlength: 200,
        placeholder: 'Youtube'
      },
      {
        t: 'website',
        title: 'Youtube',
        name: 'youtube',
        class: '',
        maxlength: 200,
        placeholder: 'Youtube'
      },

      {
        t: 'custom',
        title: 'Description',
        name: 'description',
        rules: [{ required: true, message: 'Describe the details of the bounty' }],
        render() {
          return (
            <RichEditor
              placeholder="Describe the details of the bounty"
              class="w-full"
              v-model:value={props.crowdfundingInfo.description}
            />
          )
        }
      }
    ])
    const additionalInfoRules = getFieldsRules(formFields.value)
    return {
      formFields,
      additionalInfoForm,
      additionalInfoRules
    }
  },
  render() {
    return (
      <UForm
        ref={(ref: any) => (this.additionalInfoForm = ref)}
        rules={this.additionalInfoRules}
        model={this.crowdfundingInfo}
      >
        <UFormItemsFactory fields={this.formFields} values={this.crowdfundingInfo} />
      </UForm>
    )
  }
})
