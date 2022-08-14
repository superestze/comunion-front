import { UModal } from '@comunion/components'
import { GithubFilled, GoogleFilled } from '@comunion/icons'
import { defineComponent, computed, ref, watchEffect, onUnmounted } from 'vue'
import useOAuth from '../Hooks/useOAuth'
import OAuthSignBtn from './OAuthSignBtn'
import { useUserStore } from '@/stores'

export default defineComponent({
  name: 'OAuthSignWidget',
  setup() {
    const userStore = useUserStore()
    const { googleLogin, githubLogin } = useOAuth()
    const associateWalletVisible = ref<boolean>(false)
    const dialogVisible = computed<boolean>(() => {
      return userStore.userResponse?.comerId === 0
    })

    const stop = watchEffect(() => {
      associateWalletVisible.value = dialogVisible.value
    })

    onUnmounted(() => {
      stop()
    })

    return () => (
      <>
        <UModal show={associateWalletVisible.value}></UModal>
        <div class="flex flex-col <md:mx-auto">
          <OAuthSignBtn
            onTriggerBtn={googleLogin}
            class="<md:w-586px <md:h-96px <md:rounded-12px <md:flex"
          >
            <GoogleFilled class="h-20px w-20px ml-16px mr-41px <md:text-36px <md:ml-30px <md:mr-70px" />
            <span class="text-[#231944] font-bold text-14px <md:text-32px">
              Sign in with Google
            </span>
          </OAuthSignBtn>
          <OAuthSignBtn
            onTriggerBtn={githubLogin}
            class="mt-20px <md:w-586px <md:h-96px <md:mt-36px <md:rounded-12px <md:flex"
          >
            <GithubFilled class="h-20px w-20px ml-16px mr-41px <md:text-36px <md:ml-30px <md:mr-70px" />
            <span class="text-[#231944] font-bold text-14px <md:text-32px">
              Sign in with Github
            </span>
          </OAuthSignBtn>
        </div>
      </>
    )
  }
})
