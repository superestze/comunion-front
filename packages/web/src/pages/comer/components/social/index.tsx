import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UCard,
  UForm,
  UFormItemsFactory,
  UPopover,
  USpin
} from '@comunion/components'
import { PenOutlined, DeleteFilled } from '@comunion/icons'
import { defineComponent, ref, reactive, computed, PropType } from 'vue'
import { btnGroup } from '../btnGroup'
import Edit from '../edit'
import SocialIcon from '@/components/SocialIcon'
import { SocialTypeList, soureType } from '@/constants'
import { ServiceReturn, services } from '@/services'
import { validateEmail, validateDiscord } from '@/utils/type'

type FnParam = (type: string, value?: string) => void

function socialIconComponent(
  socialObj: { [key: string]: string | undefined },
  view: boolean,
  edit: FnParam,
  del: FnParam
) {
  return SocialTypeList.map(item => {
    const social = socialObj[item.serviceKey]
    if (social) {
      if (view) {
        return <SocialIcon icon={item.value} link={view} address={social} />
      } else {
        return (
          <UPopover
            trigger="click"
            placement="top"
            v-slots={{
              trigger: () => <SocialIcon icon={item.value} />,
              default: () => (
                <div class="cursor-pointer flex m-3">
                  <PenOutlined
                    class="h-3.5 text-primary mr-4.5 w-3.5"
                    onClick={() => edit(item.value, social)}
                  />
                  <DeleteFilled class="h-3.5 text-primary w-3.5" onClick={() => del(item.value)} />
                </div>
              )
            }}
          />
        )
      }
    }
    return null
  })
}

export default defineComponent({
  props: {
    view: {
      type: Boolean,
      default: () => false
    },
    profile: {
      type: Object as PropType<NonNullable<ServiceReturn<'account@comer-profile-get'>>>,
      required: true
    }
  },
  setup(props) {
    const loading = ref(false)
    const editMode = ref<boolean>(false)
    const info = reactive<{ type: string | null; value: string | undefined }>({
      type: null,
      value: undefined
    })
    const form = ref<FormInst>()
    const fields = computed<FormFactoryField[]>(() => {
      const fields: FormFactoryField[] = [
        {
          t: 'select',
          title: 'Social tool',
          name: 'type',
          required: true,
          placeholder: 'Select a social tool',
          options: SocialTypeList
        }
      ]
      if (info.type === 'Email') {
        fields.push({
          title: 'Address',
          name: 'value',
          required: true,
          rules: [
            {
              validator: (rule, value: any) => {
                return !!value.socialLink && !value.delete
              },
              message: 'Please enter at least one contact information',
              trigger: 'blur'
            },
            {
              validator: (rule, value: any) => {
                return !!validateEmail(value.socialLink)
              }
            }
          ],
          placeholder: 'Input the Address'
        })
      } else if (info.type === 'Discord') {
        fields.push({
          title: 'Address',
          name: 'value',
          required: true,
          rules: [
            {
              validator: (rule, value) => {
                return !!value.trim()
              },
              message: 'Please enter at least one contact information',
              trigger: 'blur'
            },
            {
              validator: (rule, value) => {
                return !!validateDiscord(value)
              },
              message: 'Please enter the correct address or username',
              trigger: 'blur'
            }
          ],
          placeholder: 'Input the Address'
        })
      } else {
        fields.push({
          t: 'website',
          title: 'Address',
          name: 'value',
          required: true,
          placeholder: 'Input the Address'
        })
      }
      return fields
    })

    const socials = computed(() => {
      const result = []
      if (props.profile) {
        if (props.profile.website) {
          result.push(props.profile.website)
        }
        if (props.profile.discord) {
          result.push(props.profile.discord)
        }
        if (props.profile.facebook) {
          result.push(props.profile.facebook)
        }
        if (props.profile.linktree) {
          result.push(props.profile.linktree)
        }
        if (props.profile.telegram) {
          result.push(props.profile.telegram)
        }
        if (props.profile.twitter) {
          result.push(props.profile.twitter)
        }
        if (props.profile.email) {
          result.push(props.profile.email)
        }
        if (props.profile.medium) {
          result.push(props.profile.medium)
        }
      }
      return result
    })

    const socialsObj = computed(() => {
      return {
        website: props.profile.website,
        discord: props.profile.discord,
        facebook: props.profile.facebook,
        linktree: props.profile.linktree,
        telegram: props.profile.telegram,
        twitter: props.profile.twitter,
        email: props.profile.email,
        medium: props.profile.medium
      }
    })

    return {
      loading,
      editMode,
      fields,
      form,
      info,
      socials,
      socialsObj
    }
  },
  emits: ['Done'],
  render() {
    const handleEditMode =
      (create = false) =>
      () => {
        if (create) {
          this.info.type = null
          this.info.value = undefined
        }
        this.editMode = !this.editMode
      }

    const handleSubmit = () => {
      this.form?.validate(async err => {
        if (typeof err === 'undefined' && this.info.type) {
          this.loading = true
          await services['account@social-add-or-update']({
            socialType: soureType[this.info.type],
            socialLink: this.info.value
          })
          this.$emit('Done')
          handleEditMode()()
          this.loading = false
        }
      })
    }

    const editIcon = (type: string, value?: string) => {
      this.info.type = type
      this.info.value = value || undefined
      handleEditMode()()
    }

    const delIcon = async (type: string) => {
      this.loading = true
      await services['account@social-delete']({
        socialType: soureType[type]
      })
      this.$emit('Done')
      this.loading = false
    }

    const rules = getFieldsRules(this.fields)

    return (
      <USpin show={this.loading}>
        {this.view && this.socials.length === 0 ? null : (
          <UCard
            title="Social"
            class="mb-6"
            v-slots={{
              'header-extra': () => {
                if (this.editMode) {
                  return
                } else if (this.view) {
                  return
                }
                return <Edit onHandleClick={handleEditMode(true)}>Add New</Edit>
              }
            }}
          >
            {this.editMode ? (
              <div class="flex flex-col flex-wrap">
                <UForm rules={rules} model={this.info} ref={(ref: any) => (this.form = ref)}>
                  <UFormItemsFactory fields={this.fields} values={this.info} />
                </UForm>
                {btnGroup(handleEditMode(), handleSubmit)}
              </div>
            ) : (
              <div class="cursor-pointer flex flex-wrap gap-4">
                {this.socials.length === 0 ? (
                  <p class="text-color3 u-h5">Add your social</p>
                ) : (
                  <>{socialIconComponent(this.socialsObj, this.view, editIcon, delIcon)}</>
                )}
              </div>
            )}
          </UCard>
        )}
      </USpin>
    )
  }
})
