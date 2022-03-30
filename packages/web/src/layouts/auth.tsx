import { defineComponent, onBeforeMount } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useUserProfile } from '@/providers'

const AuthLayout = defineComponent({
  name: 'AuthLayout',
  setup(_, ctx) {
    const { replace } = useRouter()
    const { logged, user } = useUserProfile()
    onBeforeMount(() => {
      if (logged.value) {
        // when logged and profiled, you need not stay in auth page
        if (user.user?.isProfiled) {
          replace('/welcome')
        } else {
          replace('/auth/register/intro')
        }
      } else {
        replace('/auth/login')
      }
    })
    return () => (logged.value && user.user?.isProfiled ? null : <RouterView />)
  }
})

export default AuthLayout
