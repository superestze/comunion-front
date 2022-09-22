import { UTag } from '@comunion/components'
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
          <div class="font-primary font-semibold mb-2 text-[16px] truncate">
            {this.normalize.name}
          </div>
          <div class="flex flex-wrap mb-2 gap-2 items-center">
            {Array.isArray(this.normalize.skills) && (
              <>
                {this.normalize.skills.map((tag, i) => {
                  return i + 1 < 4 ? (
                    <UTag class="text-color1" key={i}>
                      {tag}
                    </UTag>
                  ) : null
                })}
                {this.normalize.skills.length - 4 > 0 ? (
                  <UTag class="text-color1">+ {this.normalize.skills.length - 4}</UTag>
                ) : null}
              </>
            )}
          </div>
          <div class="mb-2 text-[#9F9F9F] text-[14px] leading-4 u-h6">
            {this.normalize.email ? `${this.normalize.email} · ` : ''}
            {this.normalize.location ? `${this.normalize.location} · ` : ''}
            {this.normalize.timeZone}
          </div>
        </div>
      </div>
    )
  }
})
