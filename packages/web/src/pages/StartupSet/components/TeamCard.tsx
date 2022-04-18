import { ULazyImage } from '@comunion/components'
import { defineComponent, PropType } from 'vue'

interface TeamMember {
  avatar: string
  name: string
  role: string
}

const TeamCard = defineComponent({
  name: 'TeamCard',
  props: {
    teamMember: {
      type: Object as PropType<TeamMember>
    }
  },
  setup(props, ctx) {
    return () => (
      <div class="team-card flex flex-row leading-20 h-20 mb-6">
        <div class="avatar">
          <ULazyImage src={props.teamMember?.avatar ?? ''} class="h-20 w-20 rounded" />
        </div>
        <div class="member-info flex flex-col justify-center ml-6">
          <div class="u-label font-orbitron font-700 text-[18px] tracking-2px uppercase text-grey2 mb-1">
            {props.teamMember?.name}
          </div>
          <div class="u-title font-opensans font-400 text-[14px] leading-5 h-5 text-grey2">
            {props.teamMember?.role}
          </div>
        </div>
      </div>
    )
  }
})

export default TeamCard
