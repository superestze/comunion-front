import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UButton,
  UForm,
  UFormItemsFactory,
  UInput,
  UInputGroup,
  USelect
} from '@comunion/components'
import { AddCircleOutlined, MinusCircleOutlined } from '@comunion/icons'
import { defineComponent, ref, reactive, PropType } from 'vue'
import { ContactType } from '@/blocks/Bounty/typing'
import { validateEmail } from '@/utils/type'

type SocialType = {
  tags: string[]
  contacts: ContactType[]
}

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<SocialType>,
      required: true
    }
  },
  setup(props) {
    const info = reactive<SocialType>({
      tags: [],
      contacts: [
        {
          value: '123123',
          type: 1
        }
      ]
    })
    const contactOptions = ref([
      { label: 'Email', value: 1 },
      { label: 'Discord', value: 2 },
      { label: 'Telegram', value: 3 },
      { label: 'Website', value: 4 },
      { label: 'Twitter', value: 5 },
      { label: 'Docs', value: 6 },
      { label: 'Facebook', value: 7 },
      { label: 'Medium', value: 8 },
      { label: 'Linktree', value: 9 }
    ])
    const fields: FormFactoryField[] = [
      {
        t: 'startupTags',
        required: true,
        title: 'Tag',
        name: 'tags'
      },
      {
        t: 'custom',
        title: 'Social',
        name: 'social',
        rules: [
          {
            required: true,
            validator: (rule, value: ContactType[]) => {
              const hasValue = value.find(item => !!item.value)
              return !!hasValue
            },
            message: 'Please enter at least one contact information',
            trigger: 'blur'
          },
          {
            validator: (rule, value: ContactType[]) => {
              for (const item of value) {
                if (item.type === 1 && !validateEmail(item.value)) {
                  return false
                } else {
                  return true
                }
              }
              return true
            },
            message: '',
            trigger: 'blur'
          }
        ],
        render(value) {
          return (
            <div class="w-full">
              {info.contacts.map((item: ContactType, itemIndex: number) => (
                <div class="mb-4">
                  <div class="flex items-center">
                    <UInputGroup>
                      <USelect
                        options={contactOptions.value}
                        v-model:value={item.type}
                        class="w-50"
                      ></USelect>
                      <UInput
                        class="flex-1 rounded-r-lg"
                        v-model:value={item.value}
                        inputProps={{ type: item.type === 1 ? 'email' : 'text' }}
                        status={
                          item.type === 1 && item.value && !validateEmail(item.value)
                            ? 'error'
                            : undefined
                        }
                      ></UInput>
                    </UInputGroup>
                    {info.contacts.length > 1 && (
                      <div
                        class="flex items-center cursor-pointer"
                        onClick={() => {
                          info.contacts.splice(itemIndex, 1)
                          // todo
                        }}
                      >
                        <MinusCircleOutlined class="w-5 h-5 ml-4.5" />
                      </div>
                    )}
                    <div
                      class="flex items-center cursor-pointer"
                      onClick={() => {
                        info.contacts.push({ type: 2, value: '123' })
                        // todo
                      }}
                    >
                      <AddCircleOutlined class="w-5 h-5 ml-4.5" />
                    </div>
                  </div>
                  {item.type === 1 && item.value && !validateEmail(item.value) && (
                    <div class="ml-50 text-error">Please enter the correct email address</div>
                  )}
                </div>
              ))}
            </div>
          )
        }
      }
    ]
    const form = ref<FormInst>()
    return {
      form,
      fields,
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
          <div class="flex mt-10 items-center justify-end">
            <UButton class="w-30" type="primary" size="small" onClick={handleSubmit}>
              Save
            </UButton>
          </div>
        </div>
      </div>
    )
  }
})
