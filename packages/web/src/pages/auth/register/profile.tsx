import { UButton, UFormFactory, UModal } from '@comunion/components'
import type { FormFactoryField } from '@comunion/components/dist/es/UForm/FormFactory'
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import successImg from './assets/success.svg'
import RegisterLayout from './components/Layout'
import { UTC_OPTIONS } from '@/constants'
import { ServiceArg, services } from '@/services'
import { useUserStore } from '@/stores'

const RegisterProfilePage = defineComponent({
  name: 'RegisterProfilePage',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const success = ref(false)
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
        t: 'select',
        title: 'Time Zone',
        name: 'timeZone',
        required: true,
        options: UTC_OPTIONS.map(item => ({ label: item, value: item }))
      },
      {
        t: 'website',
        title: 'Website',
        name: 'website',
        placeholder: 'Your home page, blog, or company site'
      },
      {
        title: 'Email',
        name: 'email',
        required: true,
        placeholder: 'enter the correct email address'
      },
      {
        t: 'hashInput',
        category: 'comerSkill',
        title: 'Skills',
        name: 'skills',
        required: true,
        placeholder: '#Enter you skill tag'
      },
      {
        t: 'website',
        title: 'Twitter',
        name: 'twitter'
      },
      {
        t: 'website',
        title: 'Discord',
        name: 'discord'
      },
      {
        t: 'website',
        title: 'Telegram',
        name: 'telegram'
      },
      {
        t: 'website',
        title: 'Medium',
        name: 'medium'
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

    const onSubmit = async (values: Record<string, any>) => {
      const { error } = await services['account@comer-profile-create']({
        ...(values as ServiceArg<'account@comer-profile-create'>),
        avatar: 'https://comunion-avatars.s3.ap-northeast-1.amazonaws.com/avatar1.svg'
      })
      if (!error) {
        userStore.mergeProfile(values)
        success.value = true
      }
    }

    const toHomePage = () => {
      router.replace('/welcome')
    }

    const toMyDashboard = () => {
      router.replace('/dashboard')
    }

    return () => (
      <RegisterLayout>
        <div class="mx-auto max-w-226 py-[10vh]">
          <h1 class="u-h3">Basic Profile</h1>
          <p class="mt-2 mb-6 text-grey2 u-body2">
            Add your profile, a short bio, and links to your other online websites.
          </p>
          <div class="bg-white border rounded-lg border-grey5 pt-10 pb-5">
            <div class="mx-auto w-200">
              <UFormFactory fields={fields} submitText="Next step" onSubmit={onSubmit} />
              <UModal v-model:show={success.value} closable={false} maskClosable={false}>
                <div class="bg-white rounded-lg flex flex-col h-88 w-150 items-center">
                  <img src={successImg} class="h-40 mt-18 w-110" />
                  <div class="flex mt-12 items-center">
                    <UButton type="primary" ghost size="large" onClick={toHomePage}>
                      Welcome
                    </UButton>
                    <UButton class="ml-4" type="primary" size="large" onClick={toMyDashboard}>
                      My profile
                    </UButton>
                  </div>
                </div>
              </UModal>
            </div>
          </div>
        </div>
      </RegisterLayout>
    )
  }
})

export default RegisterProfilePage
