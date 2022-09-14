import { defineComponent, PropType, computed } from 'vue'
import { useRouter } from 'vue-router'
import Avatar from '@/components/Avatar'

type ProfileType = {
  skills: string[]
  comerId: string
  name: string
  avatar: string
  email: string
  location: string
  timeZone: string
}

export default defineComponent({
  name: 'PersonalCard',
  props: {
    profile: {
      type: Object as PropType<any>,
      require: true
    },
    keyMap: {
      type: Object as PropType<{ [key: string]: string }>,
      default: () => ({
        skills: 'applicantsSkills',
        comerId: 'comerId',
        name: 'name',
        avatar: 'avatar',
        email: 'email',
        location: 'location',
        timeZone: 'timeZone'
      })
    }
  },
  setup(props) {
    const router = useRouter()

    const normalize = computed<ProfileType>(() => {
      return {
        skills: props.profile[props.keyMap.skills],
        comerId: props.profile[props.keyMap.comerId],
        name: props.profile[props.keyMap.name],
        avatar: props.profile[props.keyMap.avatar],
        email: props.profile[props.keyMap.email],
        location: props.profile[props.keyMap.location],
        timeZone: props.profile[props.keyMap.timeZone]
      }
    })

    return { router, normalize }
  },

  render() {
    const toComerDetail = () => {
      this.router.push({ path: '/comer', query: { id: this.normalize?.comerId } })
    }
    return (
      <div class="flex">
        <Avatar avatar={this.normalize.avatar} onClickAvatar={toComerDetail} class="!h-12 !w-12" />
        <div class="flex-1 ml-4 ">
          <div class="mb-2 u-title3">{this.normalize.name}</div>
          <div class="flex mb-2 items-center">
            {Array.isArray(this.normalize.skills) &&
              this.normalize.skills.map((tag, i) => {
                return i + 1 < 4 ? (
                  <>
                    {i !== 0 && <i class="bg-grey5 h-3 mx-1 w-1px"></i>}
                    <span class="u-tag" key={i}>
                      {tag}
                    </span>
                  </>
                ) : null
              })}
          </div>
          <div class="mb-2 text-grey3 u-body2">
            {this.normalize.email ? `${this.normalize.email} · ` : ''}
            {this.normalize.location ? `${this.normalize.location} · ` : ''}
            {this.normalize.timeZone}
          </div>
        </div>
      </div>
    )
  }
})
