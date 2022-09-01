import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UButton,
  UForm,
  UFormItemsFactory,
  ULazyImage,
  useUpload,
  UUpload
} from '@comunion/components'
import { CheckFilled, PenOutlined, PlusOutlined, UploadFilled } from '@comunion/icons'
import { CustomRequest } from 'naive-ui/lib/upload/src/interface'
import { defineComponent, computed, ref, reactive, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useComer } from '../../hooks/comer'
import { btnGroup } from '../btnGroup'
import Edit from '../edit'

import defaultImg from './default.png'
import AvatarSelect from '@/components/Profile/AvatarSelect'
import { UTC_OPTIONS } from '@/constants'
import { services } from '@/services'

import './rect.css'
import { useUserStore } from '@/stores'

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
    },
    cover: {
      type: String,
      default: () => defaultImg,
      requried: true
    },
    view: {
      type: Boolean,
      default: () => false
    }
  },
  emits: ['Done'],
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
        placeholder: 'Input your name',
        maxlength: 24,
        rules: [
          {
            required: true,
            message: 'Name can not be blank',
            trigger: 'blur'
          }
        ]
      },
      {
        title: 'Location',
        name: 'location',
        placeholder: 'Add your location'
      },
      {
        t: 'select',
        title: 'Time Zone',
        name: 'timeZone',
        options: UTC_OPTIONS.map(item => ({ label: item.label, value: item.label }))
      }
    ]
    const info = reactive({
      avatar: props.avatar,
      name: props.name,
      location: props.location,
      timeZone: props.timeZone,
      cover: props.cover
    })

    watchEffect(() => {
      info.avatar = props.avatar
      info.name = props.name
      info.location = props.location
      info.timeZone = props.timeZone
      info.cover = props.cover
    })

    const { onUpload } = useUpload()

    const customRequest: CustomRequest = async ({ file, onProgress, onFinish, onError }) => {
      if (file.file) {
        onUpload(file.file, percent => {
          onProgress({ percent })
        })
          .then(url => {
            console.log(url)
            info.cover = url as string
            onFinish()
          })
          .catch(err => {
            onError()
          })
      }
    }
    const follow = ref<boolean>(false)

    const route = useRoute()

    const comerService = useComer(route.query.id as string)

    const toggleFollow = async (onlyGet = false) => {
      if (!onlyGet) {
        if (follow.value) {
          await comerService.unfollow()
        } else {
          await comerService.follow()
        }
      }
      if (props.view) {
        const { error, data } = await comerService.followByMe()
        if (!error) {
          follow.value = data.isFollowed
        }
      }
    }
    toggleFollow(true)

    const imageUrl = computed(() => {
      return info.cover || defaultImg
    })

    const userStore = useUserStore()
    const self = computed(() => {
      return `${route.query.id}` === `${userStore.profile?.comerID}`
    })

    return {
      subTitle,
      editMode,
      showAvatarModal,
      fields,
      info,
      form,
      customRequest,
      toggleFollow,
      follow,
      imageUrl,
      self
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
      this.form?.validate(async err => {
        if (typeof err === 'undefined') {
          console.log(this.info)
          await services['account@update-basic-info']({
            name: this.info.name,
            cover: this.info.cover,
            avatar: this.info.avatar,
            timeZone: this.info.timeZone,
            location: this.info.location
          })
          this.$emit('Done')
          handleEditMode()
        }
      })
    }

    const rules = getFieldsRules(this.fields)

    return (
      <div class="bg-white rounded-lg border mb-6 relative overflow-hidden">
        {this.editMode ? (
          <>
            <AvatarSelect v-model:show={this.showAvatarModal} v-model:avatar={this.info.avatar} />
            <UUpload
              class="rect-upload"
              customRequest={this.customRequest}
              accept="image/png, image/jpeg, image/bmp, image/psd, image/svg, image/tiff"
            >
              <div class="flex w-full h-180px relative">
                <div class="bg-[rgba(0,0,0,0.5)] absolute left-0 right-0 top-0 bottom-0"></div>
                <img src={this.imageUrl} alt="bg" class="w-full object-fill" />
                <PenOutlined class="h-4 mr-3 w-4 text-white absolute left-1/2 top-1/2 -ml-2 -mt-2" />
              </div>
            </UUpload>
            <div
              class="absolute rounded-1/2 h-20 w-20 left-1/2 top-155px -ml-10 overflow-hidden"
              onClick={showAvatarSelect}
            >
              <UploadFilled class="absolute top-1/2 left-1/2 w-6 h-6 -ml-3 -mt-3 text-white z-1" />
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
              <img src={this.imageUrl} alt="bg" class="w-full object-fill" />
            </div>
            <ULazyImage
              class="rounded-1/2 h-80px w-80px absolute left-40px top-155px"
              src={this.avatar}
            />
            <div class="w-full flex justify-end mt-20px">
              {this.view ? (
                <>
                  {!this.self ? (
                    <>
                      {this.follow ? (
                        <UButton
                          secondary
                          type="tertiary"
                          class="w-40 mr-6"
                          size="small"
                          onClick={() => this.toggleFollow()}
                        >
                          <CheckFilled class="mr-2" />
                          Unconnect
                        </UButton>
                      ) : (
                        <UButton
                          type="primary"
                          class="w-40 mr-6"
                          size="small"
                          onClick={() => this.toggleFollow()}
                        >
                          <PlusOutlined class="mr-2 w-4 h-4" />
                          Connect
                        </UButton>
                      )}
                    </>
                  ) : (
                    <UButton class="w-40 mr-6 invisible" size="small">
                      Connect
                    </UButton>
                  )}
                </>
              ) : (
                <Edit class="mr-24px" onHandleClick={handleEditMode} />
              )}
            </div>
            <div class="flex mt-30px flex-col ml-50px mb-24px mr-50px">
              <p class="text-16px font-600 text-primary2">{this.name}</p>
              <p class="text-14px text-grey3 mt-2 leading-normal">{this.subTitle}</p>
            </div>
          </>
        )}
      </div>
    )
  }
})
