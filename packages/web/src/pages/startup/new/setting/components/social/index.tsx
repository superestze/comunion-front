import {
  USpin,
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
import { contactList } from './util'
import { services } from '@/services'
import { validateEmail } from '@/utils/type'

type SocialType = {
  socialType: number
  socialLink: string
}

type DataType = {
  tags: string[]
  socials: SocialType[]
}

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<DataType>,
      required: true
    },
    startupId: {
      type: String
    }
  },
  setup(props) {
    const loading = ref(false)

    const info = reactive<DataType>(props.data)

    // 1-SocialEmail  	2-SocialWebsite 	3-SocialTwitter 	4-SocialDiscord 	5-SocialTelegram 	6-SocialMedium 	7-SocialFacebook 	8-SocialLinktre
    const contactOptions = ref(contactList)
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
            validator: (rule, value: SocialType[]) => {
              return value && !!value.find(item => !!item.socialLink)
            },
            message: 'Please enter at least one contact information',
            trigger: 'blur'
          },
          {
            validator: (rule, value: SocialType[]) => {
              if (Array.isArray(value)) {
                for (const item of value) {
                  if (item.socialType === 1 && !validateEmail(item.socialLink)) {
                    return false
                  } else {
                    return true
                  }
                }
              }

              return true
            },
            message: '',
            trigger: 'blur'
          }
        ],
        render() {
          return (
            <div class="w-full">
              {info.socials.map((item: SocialType, itemIndex: number) => (
                <div class="mb-4">
                  <div class="flex items-center">
                    <UInputGroup>
                      <USelect
                        options={contactOptions.value}
                        v-model:value={item.socialType}
                        class="w-50"
                      ></USelect>
                      <UInput
                        class="rounded-r-lg flex-1"
                        v-model:value={item.socialLink}
                        inputProps={{ type: item.socialType === 1 ? 'email' : 'text' }}
                        status={
                          item.socialType === 1 &&
                          item.socialLink &&
                          !validateEmail(item.socialLink)
                            ? 'error'
                            : undefined
                        }
                      ></UInput>
                    </UInputGroup>
                    {info.socials.length > 1 && (
                      <div
                        class="cursor-pointer flex items-center"
                        onClick={() => {
                          info.socials.splice(itemIndex, 1)
                        }}
                      >
                        <MinusCircleOutlined class="h-5 ml-4.5 w-5" />
                      </div>
                    )}
                    <div
                      class="cursor-pointer flex items-center"
                      onClick={() => {
                        info.socials.push({ socialType: 2, socialLink: '' })
                      }}
                    >
                      <AddCircleOutlined class="h-5 ml-4.5 w-5" />
                    </div>
                  </div>
                  {item.socialType === 1 && item.socialLink && !validateEmail(item.socialLink) && (
                    <div class="text-error ml-50">Please enter the correct email address</div>
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
      loading,
      form,
      fields,
      info
    }
  },
  render() {
    const handleSubmit = () => {
      this.form?.validate(async err => {
        if (!err) {
          this.loading = true
          await services['startup@social-add-or-update']({
            startupID: this.startupId,
            hashTags: this.info.tags,
            socials: this.info.socials
          })
          this.loading = false
        }
      })
    }

    const rules = getFieldsRules(this.fields)
    return (
      <USpin show={this.loading}>
        <div class="bg-white border rounded-lg mb-6 relative overflow-hidden">
          <div class="my-9.5 mx-10">
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
      </USpin>
    )
  }
})
