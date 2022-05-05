import { TeamOutlined, GroupFilled } from '@comunion/icons'
import { defineComponent } from 'vue'
import styles from './StartupCard.module.css'

const UTeamMembers = defineComponent({
  name: 'Proposal',
  setup(props, ctx) {
    return () => (
      <div class={styles.team_members}>
        <div class="float-left flex align-center">
          <span class={styles.members_svg}>
            <TeamOutlined class="text-primary m-0.5-0.5" />
          </span>
          <span class="u-body3 pl-2 pt-1">
            <i class={styles.members_span_i}>1,342</i>
          </span>
          <span class="u-body2 m-auto ml-3">Members</span>
        </div>
        <div class="float-right flex align-center">
          <span class={styles.members_svg}>
            <GroupFilled class="text-primary m-2" />
          </span>
          <span class="u-body3 pl-2 pt-1">
            <i class={styles.members_span_i}>1,223</i>
          </span>
        </div>
      </div>
    )
  }
})

export default UTeamMembers
