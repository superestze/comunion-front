import { defineComponent, watchEffect } from 'vue'
import { RouterView, useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores'

const AuthLayout = defineComponent({
  name: 'AuthLayout',
  setup(_, ctx) {
    const { path } = useRoute()
    const { replace } = useRouter()
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
