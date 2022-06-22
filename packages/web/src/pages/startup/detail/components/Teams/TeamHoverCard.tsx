import { ULazyImage, UButton } from '@comunion/components'
import { HookFilled, PlusOutlined } from '@comunion/icons'
import { defineComponent, computed, PropType, onMounted, ref } from 'vue'
import { ServiceReturn, services } from '@/services'
import { useUserStore } from '@/stores'

export const TeamHoverCard = defineComponent({
  name: 'TeamHoverCard',
  props: {
    teamMember: {
      type: Object as PropType<ServiceReturn<'account@comer-info-get'>>,
      required: true
    }
  },
  setup(props, ctx) {
    const { teamMember } = props
    const userStore = useUserStore()
    const loading = ref(false)
    const isFollow = ref(false)
    const skills = computed(() => {
      return teamMember?.comerProfile?.skills?.map((skill, skillIndex) => {
        return (
          <div>
            <span class="u-body2">{skill.name}</span>
            {skillIndex + 1 !== teamMember?.comerProfile?.skills?.length && (
              <span class="text-grey5 px-2">|</span>
            )}
          </div>
        )
      })
    })
    const getIsFollow = async (comerId: number) => {
      try {
        loading.value = true
        const { error: followError, data: followData } = await services[
          'account@comer-followed-by-me'
        ]({
          comerId
        })
        loading.value = false
        if (!followError) {
          isFollow.value = followData.isFollowed
        }
      } catch (error) {
        loading.value = false
      }
    }
    const followComer = async (comerId: number, toStatus: string) => {
      if (toStatus === 'follow') {
        await services['account@comer-follow']({
          comerId
        })
      } else {
        await services['account@comer-unfollow']({
          comerId
        })
      }
      getIsFollow(comerId)
    }
    onMounted(() => {
      getIsFollow(teamMember?.comerProfile?.comerID as number)
    })
    const disableFollow = (comerID: number) => {
      return userStore.profile?.comerID === comerID
    }
    return () => (
      <div class="px-10 relative">
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
        <div class="flex justify-center">{skills.value?.map(skill => skill)}</div>
        <div class="mt-10 text-center mb-3">
          <UButton
            loading={loading.value}
            type="primary"
            size="small"
            ghost={isFollow.value}
            disabled={disableFollow(teamMember?.comerProfile?.comerID as number)}
            onClick={() =>
              followComer(
                teamMember?.comerProfile?.comerID as number,
                isFollow.value ? 'unFollow' : 'follow'
              )
            }
            v-slots={{
              icon: () => {
                return (
                  <div class="flex items-center w-4.5">
                    {isFollow.value ? <HookFilled /> : <PlusOutlined />}
                  </div>
                )
              }
            }}
          >
            {isFollow.value ? <span>Unfollow</span> : <span>Follow</span>}
          </UButton>
        </div>
      </div>
    )
  }
})
