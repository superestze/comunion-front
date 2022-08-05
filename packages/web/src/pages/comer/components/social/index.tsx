import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UCard,
  UForm,
  UFormItemsFactory,
  UPopover
} from '@comunion/components'
import {
  DiscordFilled,
  WebsiteFilled,
  FacebookFilled,
  UnionFilled,
  TelegramFilled,
  TwitterFilled,
  MailFilled,
  MediumFilled,
  PenOutlined,
  DeleteFilled,
  PlusOutlined
} from '@comunion/icons'
import { defineComponent, ref, reactive, computed } from 'vue'
import { btnGroup } from '../btnGroup'
import Edit from '../edit'
import { SocialTypeList } from '@/constants'

function asyncComponent(type: string) {
  if (type === 'Website') {
    return <WebsiteFilled class="w-5 h-5 text-primary" />
  } else if (type === 'Discord') {
    return <DiscordFilled class="w-5 h-5 text-primary" />
  } else if (type === 'Facebook') {
    return <FacebookFilled class="w-5 h-5 text-primary" />
  } else if (type === 'Linktree') {
    return <UnionFilled class="w-5 h-5 text-primary" />
  } else if (type === 'Telegram') {
    return <TelegramFilled class="w-5 h-5 text-primary" />
  } else if (type === 'Twitter') {
    return <TwitterFilled class="w-5 h-5 text-primary" />
  } else if (type === 'Email') {
    return <MailFilled class="w-5 h-5 text-primary" />
  } else if (type === 'Medium') {
    return <MediumFilled class="w-5 h-5 text-primary" />
  }
  return
}

type FnParam = (type: string) => void

function socialIconComponent(edit: FnParam, del: FnParam) {
  return SocialTypeList.map(item => (
    <UPopover
      trigger="click"
      placement="top"
      v-slots={{
        trigger: () => (
          <div class="flex bg-purple w-12 h-12 justify-center items-center rounded-4px">
            {asyncComponent(item.value)}
          </div>
        ),
        default: () => (
          <div class="flex m-3 cursor-pointer">
            <PenOutlined class="text-primary w-3.5 h-3.5 mr-4.5" onClick={() => edit(item.value)} />
            <DeleteFilled class="text-primary w-3.5 h-3.5" onClick={() => del(item.value)} />
          </div>
        )
      }}
    />
  ))
}

export default defineComponent({
  props: {
    view: {
      type: Boolean,
      default: () => false
    },
    socials: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const editMode = ref<boolean>(false)
    const info = reactive({
      type: '',
      value: ''
    })
    const form = ref<FormInst>()
    const fields = computed<FormFactoryField[]>(() => [
      {
        t: 'select',
        title: 'Social tool',
        name: 'type',
        required: true,
        placeholder: 'Select a social tool',
        options: SocialTypeList
      },
      {
        t: 'website',
        title: 'URL',
        name: 'value',
        required: true,
        placeholder: 'Input the URL'
      }
    ])

    return {
      editMode,
      fields,
      form,
      info
    }
  },
  render() {
    const handleEditMode = () => {
      this.editMode = !this.editMode
    }

    const handleSubmit = () => {
      this.form?.validate(err => {
        console.log(err)
        if (typeof err === 'undefined') {
          console.log('yeah')
        }
      })
    }

    const editIcon = (type: string) => {
      this.info.type = type
      handleEditMode()
      console.log(type)
    }

    const delIcon = (type: string) => {
      console.log(type)
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
                  <Edit onHandleClick={handleEditMode}>
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
                {btnGroup(handleEditMode, handleSubmit)}
              </div>
            ) : (
              <div class="my-6 flex gap-4 cursor-pointer flex-wrap">
                {this.socials.length === 0 ? (
                  <p class="text-14px font-[400] text-grey4 mt-6">Add your social</p>
                ) : (
                  <>{socialIconComponent(editIcon, delIcon)}</>
                )}
              </div>
            )}
          </UCard>
        )}
      </>
    )
  }
})
