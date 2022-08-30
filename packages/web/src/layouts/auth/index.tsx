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
      if (path === '/auth/association') {
        return
      }
      if (userStore.logged) {
        // when logged and profiled, you need not stay in auth page
        if (userStore.isProfiled) {
          replace('/welcome')
        } else {
          if (!path.startsWith('/auth')) {
            replace('/auth/register/simple')
          }
        }
      } else {
        replace('/auth/login')
      }
    })

    return () => <RouterView />
  }
})

export default AuthLayout
