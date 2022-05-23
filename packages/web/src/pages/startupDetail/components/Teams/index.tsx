import { UDrawer } from '@comunion/components'
import { ArrowRightOutlined } from '@comunion/icons'
import { defineComponent, ref } from 'vue'
import { StartupTeamCard } from './TeamCard'

const MAX_SHOW_COUNT = 5

export const Team = defineComponent({
  name: 'Team',
  props: ['teamMembers', 'memberCount'],
  emits: ['viewAllMembers'],
  setup(props, ctx) {
    const visible = ref(false)
    return () => (
      <div class="mt-8">
        {props.teamMembers.length
          ? props.teamMembers
              .slice(0, MAX_SHOW_COUNT)
              .map((teamMember: any) => <StartupTeamCard teamMember={teamMember} />)
          : null}
        {props.teamMembers.length > MAX_SHOW_COUNT && (
          <div class="text-primary flex items-center justify-end">
            <div
              class="cursor-pointer flex items-center"
              onClick={() => {
                ctx.emit('viewAllMembers')
                visible.value = true
              }}
            >
              <span class="u-title2 text-primary mr-2 ">View all {props.memberCount} members</span>
              <ArrowRightOutlined class="" />
            </div>
          </div>
        )}
        <UDrawer
          title="TEAM"
          width={473}
          v-model:show={visible.value}
          v-slots={{
            whiteBoard: () => (
              <div class="mt-10 ml-11">
                {props.teamMembers.length
                  ? props.teamMembers.map((teamMember: any) => (
                      <StartupTeamCard teamMember={teamMember} />
                    ))
                  : null}
              </div>
            )
          }}
        ></UDrawer>
      </div>
    )
  }
})
