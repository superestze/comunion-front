import { UDrawer, UPopover } from '@comunion/components'
import { ArrowRightOutlined } from '@comunion/icons'
import { defineComponent, ref } from 'vue'
import { StartupTeamCard } from './TeamCard'
import { TeamHoverCard } from './TeamHoverCard'

const MAX_SHOW_COUNT = 5

export const Team = defineComponent({
  name: 'Team',
  props: ['teamMembers', 'memberCount'],
  emits: ['viewAllMembers'],
  setup(props, ctx) {
    const visible = ref(false)
    const viewAllMembers = () => {
      ctx.emit('viewAllMembers')
      visible.value = true
    }
    return () => (
      <div class="mt-8">
        {props.teamMembers.length
          ? props.teamMembers.slice(0, MAX_SHOW_COUNT).map((teamMember: any) => (
              <div>
                <UPopover
                  placement="left-start"
                  v-slots={{
                    trigger: () => <StartupTeamCard teamMember={teamMember} />,
                    default: () => <TeamHoverCard teamMember={teamMember} />
                  }}
                />
              </div>
            ))
          : null}
        {props.memberCount > MAX_SHOW_COUNT && (
          <div class="text-primary flex items-center justify-end">
            <div class="cursor-pointer flex items-center" onClick={viewAllMembers}>
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
              <div class="pt-10">
                {props.teamMembers.length
                  ? props.teamMembers.map((teamMember: any) => (
                      <UPopover
                        placement="left-start"
                        v-slots={{
                          trigger: () => <StartupTeamCard teamMember={teamMember} class="pl-11" />,
                          default: () => <TeamHoverCard teamMember={teamMember} />
                        }}
                      />
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
