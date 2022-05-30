import { defineComponent, watchEffect } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores'

const AuthLayout = defineComponent({
  name: 'AuthLayout',
  setup() {
    const { replace } = useRouter()
    const { path } = useRoute()
    const userStore = useUserStore()

    watchEffect(() => {
      if (userStore.logged) {
        // when logged and profiled, you need not stay in auth page
        if (userStore.isProfiled) {
          replace('/welcome')
        } else {
          if (!path.startsWith('/auth')) {
            replace('/auth/register/intro')
          }
        }
      } else {
        replace('/auth/login')
      }
    })

    return () => (userStore.logged && userStore.isProfiled ? null : <RouterView />)
  }
})

export default AuthLayout
