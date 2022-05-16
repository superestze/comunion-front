import { ULazyImage, message } from '@comunion/components'
import { EditFilled, DeleteFilled } from '@comunion/icons'
import { defineComponent, ref, inject, provide, PropType, watch } from 'vue'
import TeamModal from './TeamModal'
import { services } from '@/services'
export const root = ref(null)
interface TeamMember {
  comerID: number | null | undefined
  comerProfile: any | null | undefined
  startupID: number | null | undefined
  CreatedAt: string | null | undefined
  ID: string | null | undefined
  UpdatedAt: string | null | undefined
  comer: object | null | undefined
  position: string | null | undefined
}

const TeamCard = defineComponent({
  name: 'TeamCard',
  props: {
    teamMember: {
      type: Object as PropType<TeamMember>,
      require: true
    },
    paramsList: {
      type: Object,
      require: true
    },
    teamUpdate: {
      type: Function as PropType<() => void>
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
    watch(
      () => props.teamMember,
      n => {
        console.log(n)
        paramsList.value.comerID = n!.comerProfile.comerID
      }
    )
    const PARENT_PROVIDE = 'parentProvide'
    // const parent = inject(PARENT_PROVIDE)
    const parentUpDateFun: any = inject(`${PARENT_PROVIDE}/teamUpdate`)
    const parentTeamListFun: any = inject(`${PARENT_PROVIDE}/teamList`)

    const upDate = (values: object) => {
      ctx.emit('update:show', false)
      parentUpDateFun?.(values)
    }

    provide(PARENT_PROVIDE, root)
    provide(`${PARENT_PROVIDE}/upDate`, upDate)

    const teamDelete = async () => {
      const { data } = await services['startup@start-team-meabers-delete']({
        startupId: paramsList.value.startupId,
        comerId: paramsList.value.comerID
      })
      if (!data) {
        message.success('Deleted successfully!')
        parentTeamListFun?.(data)
      }
    }

    return () => (
      <div
        class="team-card flex flex-row leading-20 h-20 mb-6 hover:bg-primary hover:rounded-lg hover:text-white hover:cursor-pointer"
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
            <div class="w-7 h-7 rounded-md bg-white mr-3 leading-10 ">
              <EditFilled
                class="w-5 h-5 m-auto leading-8 mt-1 cursor-pointer"
                onClick={teamClick}
              />
            </div>
            {props.paramsList?.comerID === paramsList.value.comerID ? null : (
              <div class="w-7 h-7 rounded-md bg-white leading-10 mr-5">
                <DeleteFilled
                  class="w-5 h-5 m-auto leading-8 mt-1 cursor-pointer"
                  onClick={teamDelete}
                />
              </div>
            )}
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
