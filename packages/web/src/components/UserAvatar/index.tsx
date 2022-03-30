import { defineComponent } from 'vue'
import { useUserProfile } from '@/providers'

const UserAvatar = defineComponent({
  name: 'UserAvatar',
  // props: {},
  setup(props, ctx) {
    const { logged, user } = useUserProfile()
    return () =>
      logged.value ? (
        <div class="inline-flex items-center truncate">
          <img src={user.user.avatar} class="rounded-full h-10 w-10" />
          {user.user.name && <span class="text-sm ml-2">{user.user.name}</span>}
        </div>
      ) : (
        <span>123</span>
      )
  }
})

export default UserAvatar
