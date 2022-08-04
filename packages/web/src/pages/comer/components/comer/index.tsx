import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UForm,
  UFormItemsFactory,
  ULazyImage
} from '@comunion/components'
import { PenOutlined, UploadFilled } from '@comunion/icons'
import { defineComponent, computed, ref, reactive, watchEffect } from 'vue'
import { btnGroup } from '../btnGroup'
import Edit from '../edit'

import testImg from './onlytestcomerbg.png'
import AvatarSelect from '@/components/Profile/AvatarSelect'
import { UTC_OPTIONS } from '@/constants'

export default defineComponent({
  props: {
    avatar: {
      type: String,
      default: () => '',
      required: true
    },
    name: {
      type: String,
      default: () => '',
      required: true
    },
    location: {
      type: String,
      default: () => '',
      required: true
    },
    timeZone: {
      type: String,
      default: () => '',
      required: true
    }
  },
  setup(props) {
    const subTitle = computed(() => {
      return `${props.location}, ${props.timeZone}`
    })
    const editMode = ref<boolean>(false)
    const showAvatarModal = ref<boolean>(false)

    const form = ref<FormInst>()

    const fields: FormFactoryField[] = [
      {
        title: 'Name',
        name: 'name',
        required: true,
        placeholder: 'Input your name',
        maxlength: 24
      },
      {
        title: 'Location',
        name: 'location',
        placeholder: 'Add your location',
        required: true
      },
      {
        t: 'select',
        title: 'Time Zone',
        name: 'timeZone',
        required: true,
        options: UTC_OPTIONS.map(item => ({ label: item.label, value: item.label }))
      }
    ]
    const info = reactive({
      avatar: props.avatar,
      name: props.name,
      location: props.location,
      timeZone: props.timeZone
    })

    watchEffect(() => {
      info.avatar = props.avatar
      info.name = props.name
      info.location = props.location
      info.timeZone = props.timeZone
    })

    return {
      subTitle,
      editMode,
      showAvatarModal,
      fields,
      info,
      form
    }
  },
  render() {
    const handleEditMode = () => {
      this.editMode = !this.editMode
    }
    const showAvatarSelect = () => {
      this.showAvatarModal = true
    }
    const handleSubmit = () => {
      this.form?.validate(err => {
        if (typeof err === 'undefined') {
          console.log(this.info)
        }
      })
    }

    const rules = getFieldsRules(this.fields)

    return (
      <div class="bg-white rounded-lg border mb-6 relative overflow-hidden">
        {this.editMode ? (
          <>
            <AvatarSelect v-model:show={this.showAvatarModal} v-model:avatar={this.info.avatar} />
            <div class="flex w-full h-180px relative">
              <div class="bg-[rgba(0,0,0,0.5)] absolute left-0 right-0 top-0 bottom-0"></div>
              <img src={testImg} alt="bg" class="w-full" />
              <PenOutlined class="h-4 mr-3 w-4 text-white absolute left-1/2 top-1/2 -ml-2 -mt-2" />
            </div>
            <div
              class="absolute rounded-1/2 h-20 w-20 left-1/2 top-155px -ml-10 overflow-hidden"
              onClick={showAvatarSelect}
            >
              <UploadFilled class="absolute top-1/2 left-1/2 w-6 h-6 -ml-2 -mt-2" />
              <div class="absolute top-0 right-0 bottom-0 left-0 bg-[rgba(0,0,0,0.5)]"></div>
              <ULazyImage class="rounded-1/2 h-80px w-80px" src={this.info.avatar} />
            </div>
            <div class="mt-79px p-6">
              <UForm rules={rules} model={this.info} ref={(ref: any) => (this.form = ref)}>
                <UFormItemsFactory fields={this.fields} values={this.info} />
              </UForm>
              {btnGroup(handleEditMode, handleSubmit)}
            </div>
          </>
        ) : (
          <>
            <div class="flex w-full h-180px">
              <img src={testImg} alt="bg" class="w-full" />
            </div>
            <ULazyImage
              class="rounded-1/2 h-80px w-80px absolute left-40px top-155px"
              src={this.avatar}
            />
            <div class="w-full flex justify-end mt-20px">
              <Edit class="mr-24px" onHandleClick={handleEditMode} />
            </div>
            <div class="w-full flex mt-30px flex-col ml-50px mb-24px">
              <p class="text-16px font-[600] text-primary2">{this.name}</p>
              <p class="text-14px text-grey3">{this.subTitle}</p>
            </div>
          </>
        )}
      </div>
    )
  }
})
