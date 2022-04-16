import { ULazyImage } from '@comunion/components'
import { defineComponent } from 'vue'
import { useUserStore } from '@/stores'

const UserAvatar = defineComponent({
  name: 'UserAvatar',
  // props: {},
  setup() {
    const userStore = useUserStore()
    return () =>
      userStore.logged ? (
        <div class="inline-flex items-center truncate">
          <ULazyImage src={userStore.profile?.avatar ?? ''} class="rounded-full h-10 w-10" />
          {userStore.profile?.name && <span class="text-sm ml-2">{userStore.profile.name}</span>}
        </div>
      ) : undefined
  }
})

export default UserAvatar
