import { ULazyImage } from '@comunion/components'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export const StartupTeamCard = defineComponent({
  name: 'StartupTeamCard',
  props: ['teamMember'],
  setup(props) {
    const { teamMember } = props
    const router = useRouter()
    const toComerDetail = () => {
      router.push({ path: `/startup/detail/comer/${teamMember.comerID}` })
    }
    return () => (
      <div class="flex items-center leading-20 h-16 mb-6" onClick={toComerDetail}>
        <ULazyImage src={teamMember?.comerProfile?.avatar ?? ''} class="h-16 w-16 rounded-1\/2" />
        <div class="w-45 member-info flex flex-col justify-center ml-6">
          <div class="u-label font-orbitron font-700 text-[15px] tracking-2px uppercase mb-1 ">
            {teamMember?.comerProfile?.name}
          </div>
          <div class="u-title font-opensans font-400 text-[13px] leading-5 h-5  ">
            {teamMember?.position}
          </div>
        </div>
      </div>
    )
  }
})
