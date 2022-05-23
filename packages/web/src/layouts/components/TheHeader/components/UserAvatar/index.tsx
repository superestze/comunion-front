import { ULazyImage } from '@comunion/components'
import { defineComponent } from 'vue'
import { useUserStore } from '@/stores'

const UserAvatar = defineComponent({
  name: 'UserAvatar',
  setup() {
    const userStore = useUserStore()
    return () =>
      userStore.logged ? (
        <ULazyImage src={userStore.profile?.avatar ?? ''} class="rounded-full h-10 w-10" />
      ) : undefined
  }
})

export default UserAvatar
