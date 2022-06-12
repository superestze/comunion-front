import { defineComponent, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'

const LandingPage = defineComponent({
  name: 'LandingPage',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    watchEffect(() => {
      if (userStore.inited) {
        if (!userStore.logged) {
          // when not logged, go to login page
          router.replace('/auth/login')
        } else {
          // when logged, go to home page
          router.replace('/welcome')
        }
      }
    })
    return () => null
  }
})

export default LandingPage
