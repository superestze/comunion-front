import { UButton } from '@comunion/components'
import { GithubFilled, GoogleFilled } from '@comunion/icons'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import CardContent from '@/components/OAuth/CardContent'
import useOAuth from '@/components/OAuth/Hooks/useOAuth'
import { useUserStore } from '@/stores'

export default defineComponent({
  name: 'AccountAssociation',
  setup() {
    const { push, go } = useRouter()
    const userStore = useUserStore()
    const { googleLogin, githubLogin } = useOAuth()

    const cancelAssociation = () => {
      if (userStore.profile?.isProfiled) {
        go(-1)
        return
      }
      push('/auth/register/simple')
    }

    return () => (
      <CardContent
        title="Associating existing accounts"
        config={{ width: 524 }}
        v-slots={{
          content: () => (
            <p>
              If you already have data from another account at comunion, you can associate it with
              that account.
            </p>
          ),
          footer: () => (
            <div class="flex justify-end mt-40px">
              <UButton onClick={cancelAssociation} class="w-124px">
                Cancel
              </UButton>
              <UButton onClick={googleLogin} class="w-124px ml-14px">
                <GoogleFilled class="w-5 h-5 mr-3.5 text-primary" />
                Link
              </UButton>
              <UButton onClick={githubLogin} class="w-124px ml-14px">
                <GithubFilled class="w-5 h-5 mr-3.5 text-primary" />
                Link
              </UButton>
            </div>
          )
        }}
      />
    )
  }
})
