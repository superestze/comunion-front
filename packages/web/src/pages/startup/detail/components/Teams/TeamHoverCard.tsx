import { ULazyImage, UButton } from '@comunion/components'
import { HookFilled, PlusOutlined } from '@comunion/icons'
import { defineComponent, computed, PropType } from 'vue'
import { ServiceReturn } from '@/services'

export const TeamHoverCard = defineComponent({
  name: 'TeamHoverCard',
  props: {
    teamMember: {
      type: Object as PropType<ServiceReturn<'account@comer-info-get'>>
    }
  },
  setup(props, ctx) {
    const { teamMember } = props
    const skills = computed(() => {
      return teamMember?.comerProfile?.skills?.map((skill, skillIndex) => {
        return (
          <div>
            <span>{skill.name}</span>
            {skillIndex + 1 !== teamMember?.comerProfile?.skills?.length && (
              <span class="text-grey5 px-2">|</span>
            )}
          </div>
        )
      })
    })
    return () => (
      <div class="px-14 relative">
        <ULazyImage
          src={teamMember?.comerProfile?.avatar ?? ''}
          class="h-16 w-16 rounded-1\/2 absolute -top-10 left-[calc(50%_-_2rem)]"
        />
        <div class="u-title1 uppercase pt-10 mb-1 text-center">
          {teamMember?.comerProfile?.name}
        </div>
        <div class="u-title font-opensans font-400 text-[13px] leading-5 text-center py-1">
          {teamMember?.comerProfile?.location}
        </div>
        <div>{skills}</div>
        <div class="mt-10 text-center mb-4">
          {teamMember?.isDeleted ? (
            <UButton
              type="primary"
              size="small"
              ghost
              onClick={() => ctx.emit('unfollowStartup')}
              v-slots={{
                icon: () => {
                  return (
                    <div class="flex items-center w-4.5">
                      <HookFilled />
                    </div>
                  )
                }
              }}
            >
              Unfollow
            </UButton>
          ) : (
            <UButton
              type="primary"
              size="small"
              onClick={() => ctx.emit('followStartup')}
              v-slots={{
                icon: () => {
                  return (
                    <div class="flex items-center w-4.5">
                      <PlusOutlined />
                    </div>
                  )
                }
              }}
            >
              Follow
            </UButton>
          )}
        </div>
      </div>
    )
  }
})
