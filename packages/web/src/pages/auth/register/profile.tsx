import { defineComponent } from 'vue'

const RegisterProfilePage = defineComponent({
  name: 'RegisterProfilePage',
  setup() {
    return () => (
      <div class="mx-auto max-w-226 py-[10vh]">
        <h1 class="u-h3">Basic Profile</h1>
        <p class="mt-2 mb-6 text-grey2 u-body2">
          Add your profile , a short bio , and links to your other online websites.
        </p>
        <div class="bg-white border rounded-lg border-grey5 pt-10 pb-5">
          <div class="mx-auto min-h-300 w-200"></div>
        </div>
      </div>
    )
  }
})

export default RegisterProfilePage
