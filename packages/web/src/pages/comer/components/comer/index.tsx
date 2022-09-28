import {
  FormFactoryField,
  FormInst,
  getFieldsRules,
  UButton,
  UForm,
  UFormItemsFactory,
  ULazyImage,
  useUpload,
  UUpload,
  USpin
} from '@comunion/components'
import { CheckFilled, PenOutlined, PlusOutlined, UploadFilled } from '@comunion/icons'
import { CustomRequest } from 'naive-ui/lib/upload/src/interface'
import { defineComponent, computed, ref, reactive, watchEffect, PropType } from 'vue'
import { useRoute } from 'vue-router'
import { useComer } from '../../hooks/comer'
import { btnGroup } from '../btnGroup'
import Edit from '../edit'

import defaultImg from './default.png'
import { OAuthLinkWidget } from '@/components/OAuth'
import { ComerAccount } from '@/components/OAuth/Link/OAuthLinkWidget'
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
      default: () => null,
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
    },
    comerAccounts: {
      type: Object as PropType<ComerAccount[]>,
      default: () => []
    }
  },
  emits: ['Done'],
  setup(props) {
    const userStore = useUserStore()
    const loading = ref(false)
    const subTitle = computed(() => {
      const result = []
      props.location && result.push(props.location)
      props.timeZone && result.push(props.timeZone)
      return `${result.join(', ')}`
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
        placeholder: `Choose your time zone`,
        options: UTC_OPTIONS.map(item => ({ label: item.label, value: item.label }))
      }
    ]
    const info = reactive({
      avatar: props.avatar,
      name: props.name,
      location: props.location,
      timeZone: props.timeZone ? props.timeZone : null,
      cover: props.cover
    })

    watchEffect(() => {
      info.avatar = props.avatar
      info.name = props.name
      info.location = props.location
      info.timeZone = props.timeZone ? props.timeZone : null
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

    const self = computed(() => {
      return `${route.query.id}` === `${userStore.profile?.comerID}`
    })

    return {
      loading,
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
      self,
      userStore
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
          this.loading = true
          await services['account@update-basic-info']({
            name: this.info.name,
            cover: this.info.cover,
            avatar: this.info.avatar,
            timeZone: this.info.timeZone ? this.info.timeZone : '',
            location: this.info.location
          })
          this.$emit('Done')
          handleEditMode()
          this.loading = false
          this.userStore.mergeProfile({ avatar: this.info.avatar })
        }
      })
    }

    const rules = getFieldsRules(this.fields)

    return (
      <USpin show={this.loading}>
        <div class="bg-white border border-color-border rounded-sm mb-6 relative overflow-hidden">
          {this.editMode ? (
            <>
              <AvatarSelect v-model:show={this.showAvatarModal} v-model:avatar={this.info.avatar} />
              <UUpload
                class="rect-upload"
                customRequest={this.customRequest}
                accept="image/png, image/jpeg, image/bmp, image/psd, image/svg, image/tiff"
              >
                <div class="flex h-45 w-full relative">
                  <div class="bg-[rgba(0,0,0,0.5)] top-0 right-0 bottom-0 left-0 absolute"></div>
                  <img src={this.imageUrl} alt="bg" class="object-fill w-full" />
                  <PenOutlined class="h-4 -mt-2 mr-3 text-white -ml-2 top-1/2 left-1/2 w-4 absolute" />
                </div>
              </UUpload>
              <div
                class="rounded-1/2 h-20 -ml-10 top-155px left-1/2 w-20 absolute overflow-hidden"
                onClick={showAvatarSelect}
              >
                <UploadFilled class="h-6 -mt-3 text-white -ml-3 top-1/2 left-1/2 w-6 z-1 absolute" />
                <div class="bg-[rgba(0,0,0,0.5)] top-0 right-0 bottom-0 left-0 absolute"></div>
                <ULazyImage class="rounded-1/2 h-20 w-20" src={this.info.avatar} />
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
              <div class="h-45">
                <img src={this.imageUrl} alt="bg" class="h-full object-cover w-full" />
              </div>
              <ULazyImage
                class="rounded-1/2 h-20 top-155px left-6 w-20 absolute"
                src={this.avatar}
              />
              <div class="flex mt-5 w-full pr-6 justify-end">
                {this.view ? (
                  <>
                    {!this.self ? (
                      <>
                        {this.follow ? (
                          <UButton
                            secondary
                            type="tertiary"
                            size="small"
                            onClick={() => this.toggleFollow()}
                          >
                            <CheckFilled class="mr-2" />
                            Unconnect
                          </UButton>
                        ) : (
                          <UButton type="primary" size="small" onClick={() => this.toggleFollow()}>
                            <PlusOutlined class="h-4 mr-2 w-4" />
                            Connect
                          </UButton>
                        )}
                      </>
                    ) : (
                      <UButton class="mr-6 w-40 invisible" size="small">
                        Connect
                      </UButton>
                    )}
                  </>
                ) : (
                  <Edit onHandleClick={handleEditMode} />
                )}
              </div>
              <div class="flex flex-col mt-8 mb-6 px-6">
                <p class="text-color1 u-h3">{this.name}</p>
                <p class="mt-2 text-color3 u-h6">{this.subTitle}</p>
                {/* oauth */}
                {!this.view && (
                  <div class="flex flex-wrap mt-6">
                    <OAuthLinkWidget
                      comerAccounts={this.comerAccounts}
                      onUpdate={() => this.$emit('Done')}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </USpin>
    )
  }
})
