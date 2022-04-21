import { FormFactoryField, UDrawer, UFormFactory, ULazyImage } from '@comunion/components'
import { PlusOutlined } from '@comunion/icons'
import { defineComponent, PropType, ref } from 'vue'
import AvatarSelect from '@/components/Profile/AvatarSelect'
import { ServiceArg, ServiceReturn, services } from '@/services'
import { useUserStore } from '@/stores'

const EditProfile = defineComponent({
  name: 'EditProfile',
  props: {
    myProfile: {
      type: Object as PropType<ServiceReturn<'account@comer-profile-get'>>,
      required: true
    }
  },
  setup(props, ctx) {
    const editProfile = () => {
      show.value = true
    }
    const show = ref(false)
    const fields: FormFactoryField[] = [
      {
        title: 'Name',
        name: 'name',
        required: true,
        placeholder: 'what do you want people to call you ?'
      },
      {
        title: 'Location',
        name: 'location',
        placeholder: 'Please enter the city of residence'
      },
      {
        t: 'website',
        title: 'Website',
        name: 'website',
        placeholder: 'Your home page, blog, or company site'
      },
      {
        t: 'hashInput',
        category: 'comerSkill',
        title: 'Skills',
        name: 'skills',
        required: true,
        placeholder: '#UI design  #UX design'
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

      if (!error) {
        userStore.mergeProfile(values)
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
                  Choose your avatar
                </a>
              </div>

              <UFormFactory
                initialValues={props.myProfile!}
                fields={fields}
                showCancel={true}
                submitText="Confirm"
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
