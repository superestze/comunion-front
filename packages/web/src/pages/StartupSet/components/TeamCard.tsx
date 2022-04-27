import { ULazyImage, message } from '@comunion/components'
import { EditFilled, DeleteFilled } from '@comunion/icons'
import { defineComponent, ref, inject, provide } from 'vue'
import TeamModal from './TeamModal'
import { services } from '@/services'
export const root = ref(null)
// interface TeamMember {
//   comerID: number | null | undefined
//   comerProfile: any | null | undefined
//   startupID: number | null | undefined
//   position: string | null | undefined
// }

const TeamCard = defineComponent({
  name: 'TeamCard',
  props: {
    teamMember: {
      type: Object
    }
  },
  setup(props, ctx) {
    const showTooltipRef = ref<boolean>(false)
    const success = ref(false)
    const teamClick = () => {
      success.value = true
    }
    const paramsList = ref({
      startupId: props.teamMember?.startupID,
      comerID: props.teamMember?.comerProfile.comerID,
      teamList: props.teamMember
    })

    const PARENT_PROVIDE = 'parentProvide'
    // const parent = inject(PARENT_PROVIDE)
    const parentUpDataFun: any = inject(`${PARENT_PROVIDE}/teamUpdata`)
    const parentTeamListFun: any = inject(`${PARENT_PROVIDE}/teamList`)

    const upData = (values: object) => {
      ctx.emit('update:show', false)
      parentUpDataFun?.(values)
    }

    provide(PARENT_PROVIDE, root)
    provide(`${PARENT_PROVIDE}/upData`, upData)

    const teamDelete = async () => {
      const { data } = await services['startup@start-team-meabers-delete']({
        startupId: paramsList.value.startupId,
        comerId: paramsList.value.comerID
      })
      if (!data) {
        message.success('Deleted successfully!')
        console.log(data)
        parentTeamListFun?.(data)
      }
    }

    return () => (
      <div
        class="team-card flex flex-row leading-20 h-20 mb-6 hover:bg-blue-600 hover:rounded-lg hover:text-light-50 hover:cursor-pointer"
        onMouseleave={e => {
          e.stopPropagation()
          showTooltipRef.value = false
        }}
        onMouseenter={e => {
          e.stopPropagation()
          showTooltipRef.value = true
        }}
      >
        <div class="avatar">
          <ULazyImage
            src={props.teamMember?.comerProfile?.avatar ?? ''}
            class="h-16 w-16 rounded-1\/2 mt-2 ml-5"
          />
        </div>
        <div class="w-45 member-info flex flex-col justify-center ml-6">
          <div class="u-label font-orbitron font-700 text-[15px] tracking-2px uppercase mb-1 ">
            {props.teamMember?.comerProfile?.name}
          </div>
          <div class="u-title font-opensans font-400 text-[13px] leading-5 h-5  ">
            {props.teamMember?.position}
          </div>
        </div>
        {showTooltipRef.value && (
          <div class="flex flex-row justify-center m-auto text-center">
            <div class="w-7 h-7  rounded-md bg-light-50 mr-3 leading-10 text-blue-900">
              <EditFilled
                class="w-5 h-5 m-auto leading-8 mt-1 cursor-pointer"
                onClick={teamClick}
              />
            </div>
            <div class="w-7 h-7  rounded-md  bg-light-50 leading-10 text-green">
              <DeleteFilled
                class="w-5 h-5 m-auto leading-8 mt-1 cursor-pointer"
                onClick={teamDelete}
              />
            </div>
          </div>
        )}
        {success.value && (
          <TeamModal v-model:show={success.value} teamList={props.teamMember as any} />
        )}
      </div>
    )
  }
})

export default TeamCard
