import { FormFactoryField, UDrawer, UFormFactory } from '@comunion/components'
import { FormData } from '@comunion/components/src'
import { PlusOutlined } from '@comunion/icons'
import { defineComponent, PropType, ref } from 'vue'
import { useUserProfile } from '@/providers'
import { services } from '@/services'

const EditProfile = defineComponent({
  name: 'EditProfile',
  props: {
    myProfile: {
      type: Object as PropType<FormData>
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
    const { user, setUser } = useUserProfile()

    const onCancel = () => {
      show.value = false
    }

    const onSubmit = async (
      values: Parameters<typeof services['account@comer-profile-update']>[0]
    ) => {
      const { error } = await services['account@comer-profile-update']({
        avatar: 'https://comunion-avatars.s3.ap-northeast-1.amazonaws.com/avatar1.svg',
        ...values
      })
      if (!error) {
        setUser({ ...user.user, ...values })
      }
      show.value = false
    }

    return () => (
      <>
        {/* plus icon */}
        <span
          onClick={editProfile}
          class="flex flex-row items-center text-primary font-opensans font-700 text-[14px] tracking-2px cursor-pointer"
        >
          <PlusOutlined class="h-4 mr-3 w-4" />
          EDIT
        </span>

        {/* sidebar drawer */}
        <UDrawer title="Edit" v-model:show={show.value}>
          {show.value && (
            <UFormFactory
              initialValues={props?.myProfile}
              fields={fields}
              showCancel={true}
              submitText="Confirm"
              cancelText="Cancel"
              onSubmit={onSubmit}
              onCancel={onCancel}
            />
          )}
        </UDrawer>
      </>
    )
  }
})

export default EditProfile
