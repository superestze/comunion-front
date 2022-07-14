import { defineComponent, PropType, computed } from 'vue'
import { useRouter } from 'vue-router'
import Avatar from '@/components/Avatar'
import { ProfileState } from '@/stores/profile'

export default defineComponent({
  props: {
    profile: {
      type: Object as PropType<ProfileState['detail']>,
      require: true
    }
  },
  setup(props) {
    const router = useRouter()

    const skills = computed(() => {
      return props.profile?.skills?.map(skill => skill.name).join(' | ')
    })

    const toComerDetail = () => {
      router.push({ path: `/startup/detail/comer/${props.profile?.comerID}` })
    }

    return () => (
      <div class="flex">
        <Avatar avatar={props.profile?.avatar ?? ''} onClickAvatar={toComerDetail} />
        <div class="flex flex-col ml-5 justify-center">
          <div class="mb-2 u-title1">{props.profile?.name}</div>
          <div class="mb-2">{skills.value}</div>
          <div class="mb-2 text-grey3 u-body2">
            {props.profile?.email} · {props.profile?.location} · {props.profile?.timeZone}
          </div>
        </div>
      </div>
    )
  }
})
