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
import { defineComponent, ref, reactive, computed, PropType, watch } from 'vue'
import { btnGroup } from '../btnGroup'
import Edit from '../edit'
import SocialIcon from '@/components/SocialIcon'
import { SocialTypeList, soureType } from '@/constants'
import { ServiceReturn, services } from '@/services'

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
      }
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
    },
    profile: {
      type: Object as PropType<NonNullable<ServiceReturn<'account@comer-profile-get'>>>,
      required: true
    }
  },
  setup(props) {
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

    watch(
      () => props.profile,
      value => {
        console.log(value, 123123123)
      },
      {
        deep: true,
        immediate: true,
        flush: 'sync'
      }
    )

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
          this.$emit('Done')
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
      this.$emit('Done')
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
                  <>{socialIconComponent(this.socialsObj, this.view, editIcon, delIcon)}</>
                )}
              </div>
            )}
          </UCard>
        )}
      </>
    )
  }
})
