import { TeamOutlined } from '@comunion/icons'
import { defineComponent } from 'vue'
import styles from './StartupCard.module.css'

const UTeamMembers = defineComponent({
  name: 'Proposal',
  setup(props, ctx) {
    return () => (
      <div class={styles.team_members}>
        <div class="flex align-center">
          <span class={styles.members_svg}>
            <TeamOutlined class="text-primary m-0.5-0.5" />
          </span>
          <span class="pl-3 text-20px font-bold pt-1">
            <i class={styles.members_span_i}>1,342</i>
          </span>
          <span class="m-auto ml-3">Members</span>
        </div>
      </div>
    )
  }
})

export default UTeamMembers
