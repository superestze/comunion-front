import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UCard,
  UForm,
  UFormItemsFactory,
  UPopover
} from '@comunion/components'
import { PenOutlined, DeleteFilled, PlusOutlined } from '@comunion/icons'
import { defineComponent, ref, reactive, computed } from 'vue'
import { useProfile } from '../../hooks/useProfile'
import { btnGroup } from '../btnGroup'
import Edit from '../edit'
import SocialIcon from '@/components/SocialIcon'
import { SocialTypeList, soureType } from '@/constants'
import { services } from '@/services'

type FnParam = (type: string, value?: string) => void

function socialIconComponent(
  socialObj: { [key: string]: string | undefined },
  edit: FnParam,
  del: FnParam
) {
  return SocialTypeList.map(item => {
    const social = socialObj[item.serviceKey]
    if (social) {
      return (
        <UPopover
          trigger="click"
          placement="top"
          v-slots={{
            trigger: () => <SocialIcon icon={item.value} />,
            default: () => (
              <div class="flex m-3 cursor-pointer">
                <PenOutlined
                  class="text-primary w-3.5 h-3.5 mr-4.5"
                  onClick={() => edit(item.value, social)}
                />
                <DeleteFilled class="text-primary w-3.5 h-3.5" onClick={() => del(item.value)} />
              </div>
            )
          }}
        />
      )
    }
    return null
  })
}

export default defineComponent({
  props: {
    view: {
      type: Boolean,
      default: () => false
    }
  },
  setup() {
    const instance = useProfile()

    const editMode = ref<boolean>(false)
    const info = reactive({
      type: '',
      value: ''
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
            { type: 'string', message: 'Input the Address' },
            { type: 'email', message: 'Enter the correct email address' }
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
      if (instance.profile.value) {
        if (instance.profile.value.website) {
          result.push(instance.profile.value.website)
        }
        if (instance.profile.value.discord) {
          result.push(instance.profile.value.discord)
        }
        if (instance.profile.value.facebook) {
          result.push(instance.profile.value.facebook)
        }
        if (instance.profile.value.linktree) {
          result.push(instance.profile.value.linktree)
        }
        if (instance.profile.value.telegram) {
          result.push(instance.profile.value.telegram)
        }
        if (instance.profile.value.twitter) {
          result.push(instance.profile.value.twitter)
        }
        if (instance.profile.value.email) {
          result.push(instance.profile.value.email)
        }
        if (instance.profile.value.medium) {
          result.push(instance.profile.value.medium)
        }
      }
      return result
    })

    const socialsObj = computed(() => {
      return {
        website: instance.profile.value?.website,
        discord: instance.profile.value?.discord,
        facebook: instance.profile.value?.facebook,
        linktree: instance.profile.value?.linktree,
        telegram: instance.profile.value?.telegram,
        twitter: instance.profile.value?.twitter,
        email: instance.profile.value?.email,
        medium: instance.profile.value?.medium
      }
    })

    return {
      editMode,
      fields,
      form,
      info,
      socials,
      socialsObj,
      get: instance.getProfileData
    }
  },
  render() {
    const handleEditMode =
      (create = false) =>
      () => {
        if (create) {
          this.info.type = ''
          this.info.value = ''
        }
        this.editMode = !this.editMode
      }

    const handleSubmit = () => {
      this.form?.validate(async err => {
        if (typeof err === 'undefined') {
          await services['account@social-add-or-update']({
            socialType: soureType[this.info.type],
            socialLink: this.info.value
          })
          this.get()
          handleEditMode()()
        }
      })
    }

    const editIcon = (type: string, value?: string) => {
      this.info.type = type
      this.info.value = value as string
      handleEditMode()()
    }

    const delIcon = async (type: string) => {
      await services['account@social-delete']({
        socialType: soureType[type]
      })
      this.get()
    }

    const rules = getFieldsRules(this.fields)

    return (
      <>
        {this.view && this.socials.length === 0 ? null : (
          <UCard
            title="SOCIAL"
            class="mb-6"
            v-slots={{
              'header-extra': () => {
                if (this.editMode) {
                  return
                } else if (this.view) {
                  return
                }
                return (
                  <Edit onHandleClick={handleEditMode(true)}>
                    <PlusOutlined class="h-4 mr-3 w-4" />
                    ADD NEW
                  </Edit>
                )
              }
            }}
          >
            {this.editMode ? (
              <div class="flex flex-col mt-6 flex-wrap">
                <UForm rules={rules} model={this.info} ref={(ref: any) => (this.form = ref)}>
                  <UFormItemsFactory fields={this.fields} values={this.info} />
                </UForm>
                {btnGroup(handleEditMode(), handleSubmit)}
              </div>
            ) : (
              <div class="my-6 flex gap-4 cursor-pointer flex-wrap">
                {this.socials.length === 0 ? (
                  <p class="text-14px font-[400] text-grey4">Add your social</p>
                ) : (
                  <>{socialIconComponent(this.socialsObj, editIcon, delIcon)}</>
                )}
              </div>
            )}
          </UCard>
        )}
      </>
    )
  }
})
