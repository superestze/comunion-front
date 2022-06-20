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
        <div class="flex items-center">
          <OAuthSignBtn onTriggerBtn={googleLogin}>
            <GoogleFilled />
          </OAuthSignBtn>
          <OAuthSignBtn onTriggerBtn={githubLogin}>
            <GithubFilled />
          </OAuthSignBtn>
        </div>
      </>
    )
  }
})
