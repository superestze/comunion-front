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
  USelect,
  message
} from '@comunion/components'
import { AddCircleOutlined, MinusCircleOutlined } from '@comunion/icons'
import { defineComponent, ref, reactive, PropType, watch } from 'vue'
import { contactList } from './util'
import { services } from '@/services'
import { validateEmail, validateTelegram } from '@/utils/type'

type SocialType = {
  socialType: number
  socialLink: string
  delete?: boolean
  blur?: boolean
}

type DataType = {
  tags: string[]
  socials: SocialType[]
}

export default defineComponent({
  name: 'socialSetting',
  props: {
    data: {
      type: Object as PropType<DataType>,
      required: true
    },
    startupId: {
      type: String
    }
  },
  emits: ['saved'],
  setup(props) {
    const loading = ref(false)

    const info = reactive<DataType>(props.data)

    watch(
      () => info,
      () => {
        if (!info.socials.filter(e => !e.delete).length) {
          info.socials.push({ socialType: 1, socialLink: '' })
        }
      },
      {
        immediate: true
      }
    )

    // 1-SocialEmail  	2-SocialWebsite 	3-SocialTwitter 	4-SocialDiscord 	5-SocialTelegram 	6-SocialMedium 	7-SocialFacebook 	8-SocialLinktre
    const contactOptions = ref(contactList)
    const fields: FormFactoryField[] = [
      // {
      //   t: 'startupTags',
      //   required: true,
      //   title: 'Tag',
      //   name: 'tags'
      // },
      {
        t: 'custom',
        title: 'Social',
        name: 'socials',
        rules: [
          {
            validator: (rule, value: SocialType[]) => {
              return !!value.find(item => !!item.socialLink && !item.delete)
            },
            message: 'Please enter at least one contact information',
            trigger: 'blur'
          },
          {
            validator: (rule, value: SocialType[]) => {
              const items = value.filter(item => !item.delete && !!item.socialLink)
              if (items.length) {
                for (const item of items) {
                  if (
                    (item.socialType === 1 && !validateEmail(item.socialLink)) ||
                    (item.socialType === 5 && !validateTelegram(item.socialLink))
                  ) {
                    return false
                  } else {
                    return !!item.socialLink.trim()
                  }
                }
              }

              return true
            }
          }
        ],
        render() {
          return (
            <div class="w-full">
              {info.socials
                .filter(e => !e.delete)
                .map((item: SocialType, itemIndex: number) => (
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
                            (item.socialType === 1 &&
                              item.socialLink &&
                              !validateEmail(item.socialLink)) ||
                            (item.socialType === 5 &&
                              item.socialLink &&
                              !validateTelegram(item.socialLink))
                              ? 'error'
                              : undefined
                          }
                          onBlur={() => {
                            item.blur = true
                          }}
                          onFocus={() => {
                            item.blur = false
                          }}
                        ></UInput>
                      </UInputGroup>
                      {info.socials.filter(e => !e.delete).length > 1 && (
                        <div
                          class="cursor-pointer flex items-center"
                          onClick={() => {
                            info.socials[itemIndex]['delete'] = true
                          }}
                        >
                          <MinusCircleOutlined class="h-5 text-error ml-4.5 w-5" />
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
                    {item.socialType === 1 &&
                      item.blur &&
                      item.socialLink &&
                      !validateEmail(item.socialLink) && (
                        <div class="text-error ml-50">Please enter the correct email address</div>
                      )}
                    {item.socialType === 5 &&
                      item.blur &&
                      item.socialLink &&
                      !validateTelegram(item.socialLink) && (
                        <div class="text-error ml-50">Invalid Telegram contract</div>
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
            socials: this.info.socials.filter(e => !e.delete),
            deletedSocials: this.info.socials.filter(e => e.delete).map(e => e.socialType)
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
