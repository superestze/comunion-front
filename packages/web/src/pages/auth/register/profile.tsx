import { defineComponent } from 'vue'
import { UButton, UFormFactory } from '@comunion/components'
import type { FormFactoryField } from '@comunion/components/dist/es/UForm/FormFactory'

const RegisterProfilePage = defineComponent({
  name: 'RegisterProfilePage',
  setup() {
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
        rows: 5
      }
    ]

    const onSubmit = (values: Record<string, any>) => {
      console.log(values)
    }

    return () => (
      <div class="mx-auto max-w-226 py-[10vh]">
        <h1 class="u-h3">Basic Profile</h1>
        <p class="mt-2 mb-6 text-grey2 u-body2">
          Add your profile , a short bio , and links to your other online websites.
        </p>
        <div class="bg-white border rounded-lg border-grey5 pt-10 pb-5">
          <div class="mx-auto min-h-300 w-200">
            <UFormFactory fields={fields} onSubmit={onSubmit}>
              <div class="flex justify-end">
                <UButton attrType="submit" type="primary" size="large" class="w-30">
                  Next step
                </UButton>
              </div>
            </UFormFactory>
          </div>
        </div>
      </div>
    )
  }
})

export default RegisterProfilePage
