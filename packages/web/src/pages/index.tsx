import { defineComponent, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'

const LandingPage = defineComponent({
  name: 'LandingPage',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    watchEffect(() => {
      if (userStore.profile) {
        if (!userStore.logged) {
          // when not logged, go to login page
          router.replace('/auth/login')
        } else {
          // when logged, go to home page
          router.replace('/startup/list')
        }
      }
    })
    return () => null
  }
})

export default LandingPage
