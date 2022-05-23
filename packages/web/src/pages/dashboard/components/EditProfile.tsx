import { FormFactoryField, UDrawer, UFormFactory, ULazyImage } from '@comunion/components'
import { PlusOutlined } from '@comunion/icons'
import { defineComponent, PropType, reactive, ref } from 'vue'
import AvatarSelect from '@/components/Profile/AvatarSelect'
import { UTC_OPTIONS } from '@/constants'
import { ServiceArg, ServiceReturn, services } from '@/services'
import { useUserStore } from '@/stores'

const EditProfile = defineComponent({
  name: 'EditProfile',
  props: {
    myProfile: {
      type: Object as PropType<ServiceReturn<'account@comer-profile-get'>>,
      required: true
    },
    getDataList: {
      type: Function as PropType<() => void>
    }
  },
  setup(props, ctx) {
    const editProfile = () => {
      show.value = true
    }
    const profileInfo = reactive({
      ...props!.myProfile,
      skills: (props!.myProfile!.skills || []).map(s => s.name)
    })
    const show = ref(false)
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
        placeholder: 'Add your location'
      },
      {
        t: 'select',
        title: 'Time Zone',
        name: 'timeZone',
        required: true,
        options: UTC_OPTIONS.map(item => ({ label: item.value, value: item.value }))
      },
      {
        t: 'website',
        title: 'Website',
        name: 'website',
        placeholder: 'Add your homepage,blog,website .etc'
      },
      {
        title: 'Email',
        name: 'email',
        required: true,
        rules: [
          { type: 'string', message: 'Your contact email' },
          { type: 'email', message: 'Enter the correct email address' }
        ],
        placeholder: 'Your contact email'
      },
      {
        t: 'hashInput',
        category: 'comerSkill',
        title: 'Skills',
        name: 'skills',
        required: true,
        placeholder: 'Add your skill tag'
      },
      {
        t: 'website',
        defaultValue: '',
        title: 'Twitter',
        name: 'twitter',
        placeholder: 'Enter twitter'
      },
      {
        t: 'website',
        defaultValue: '',
        title: 'Discord',
        name: 'discord',
        placeholder: 'Enter discord'
      },
      {
        t: 'website',
        defaultValue: '',
        title: 'Telegram',
        name: 'telegram',
        placeholder: 'Enter telegram'
      },
      {
        t: 'website',
        defaultValue: '',
        title: 'Medium',
        name: 'medium',
        placeholder: 'Enter medium'
      },
      {
        title: 'Bio',
        name: 'bio',
        required: true,
        type: 'textarea',
        placeholder: 'Tell us about yourself, at least 100 characters',
        minlength: 100,
        rules: [{ min: 100, message: 'Tell us about yourself, at least 100 characters' }],
        // @ts-ignore
        autosize: {
          minRows: 5,
          maxRows: 10
        }
      }
    ]
    const userStore = useUserStore()

    const onCancel = () => {
      show.value = false
    }
    const showAvatarModal = ref(false)
    const avatar = ref(props?.myProfile?.avatar || '')
    const showAvatarSelect = () => {
      showAvatarModal.value = true
    }
    const onSubmit = async (values: Record<string, any>) => {
      const { error } = await services['account@comer-profile-update']({
        ...(values as ServiceArg<'account@comer-profile-update'>),
        avatar: avatar.value
      })
      console.log(error)
      if (!error) {
        userStore.mergeProfile(values)
        props.getDataList?.()
      }
      show.value = false
    }

    return () => (
      <>
        <span
          onClick={editProfile}
          class="u-label2 flex flex-row items-center text-primary cursor-pointer"
        >
          <PlusOutlined class="h-4 mr-3 w-4" />
          EDIT
        </span>

        {/* sidebar drawer */}
        <UDrawer title="Edit" v-model:show={show.value}>
          {show.value && (
            <>
              <div class="flex flex-row items-center mb-6">
                <div class="mr-4">
                  <ULazyImage src={avatar.value} class="h-20 w-20 rounded" />
                </div>
                <a class="u-title2 text-primary cursor-pointer" onClick={showAvatarSelect}>
                  Update
                </a>
              </div>

              <UFormFactory
                initialValues={profileInfo}
                fields={fields}
                showCancel={true}
                submitText="Submit"
                cancelText="Cancel"
                onSubmit={onSubmit}
                onCancel={onCancel}
              />

              <AvatarSelect v-model:show={showAvatarModal.value} v-model:avatar={avatar.value} />
            </>
          )}
        </UDrawer>
      </>
    )
  }
})

export default EditProfile
