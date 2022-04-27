import { UInput, UInputGroup, UButton, message } from '@comunion/components'
import { defineComponent, PropType, ref, provide, onMounted } from 'vue'
import TeamModal from './TeamModal'
import TeamCard from '@/pages/StartupSet/components/TeamCard'
import { services } from '@/services'
import { StartupItem } from '@/types'
export const root = ref(null)

const TeamSetting = defineComponent({
  name: 'TeamSetting',
  props: {
    startup: {
      type: Object as PropType<StartupItem>
    }
  },
  setup(props, ctx) {
    const success = ref(false)
    const paramsList = ref({
      id: props.startup?.id,
      comerID: props.startup?.comerID,
      roles: null,
      name: props.startup?.name,
      tokenContractAddress: props.startup?.tokenContractAddress,
      pageSize: 99,
      page: 1,
      comerProfile: Object
    })
    const comerProfile = ref<object>({})
    const teamMembers = ref<StartupItem[]>([])
    const inputMember = ref<string>('')

    const searchMember = async () => {
      if (inputMember.value) {
        const { data } = await services['account@comer-info-get-by-address']({
          address: inputMember.value
        })
        console.log(typeof data)
        if (!data) {
          message.error('Search no results!')
          throw new Error('Search no results!')
        }
        const filterData = teamMembers.value.filter(
          item => item!.comerID === data.comerProfile!.comerID
        )
        if (filterData.length) {
          message.error('Already exists!')
        } else {
          comerProfile.value = data!
          success.value = true
        }
      } else {
        message.info('Please enter the content!')
        throw new Error('Please enter the content!')
      }
    }

    const teamList = async () => {
      const { data } = await services['startup@start-team-meabers-list']({
        startupId: paramsList.value.id,
        limit: paramsList.value.pageSize,
        offset: paramsList.value.pageSize * (paramsList.value.page - 1)
      })
      if (data?.list.length) {
        teamMembers.value.length = 0
        teamMembers.value.push(...(data!.list as unknown as StartupItem[]))
      } else {
        teamMembers.value.length = 0
      }
    }

    const teamCreate = async (val: any) => {
      const { data } = await services['startup@start-team-meabers-create']({
        startupId: paramsList.value.id,
        comerId: val.comerId,
        position: val.roles
      })
      if (!data) {
        message.success('Role created successfully!')
        teamList()
      }
    }

    const teamUpdata = async (val: any) => {
      console.log(val)
      const { data } = await services['startup@start-team-meabers-update']({
        startupId: paramsList.value.id,
        comerId: val.comerId,
        position: val.roles
      })
      if (!data) {
        message.success('Role modified successfully!')
        teamList()
      }
    }

    const PARENT_PROVIDE = 'parentProvide'
    provide(PARENT_PROVIDE, root)
    provide(`${PARENT_PROVIDE}/teamCreate`, teamCreate)
    provide(`${PARENT_PROVIDE}/teamUpdata`, teamUpdata)
    provide(`${PARENT_PROVIDE}/teamList`, teamList)

    onMounted(() => {
      teamList()
    })

    return () => (
      <div class="team-setting">
        {/*  title */}
        <span class="font-orbitron font-700 text-[18px] leading-6 tracking-2px text-primary1">
          TEAM SETTING
        </span>
        {/* search input */}
        <div class="search mt-10">
          <UInputGroup>
            <UInput class="h-12 leading-12" v-model:value={inputMember.value} />
            <UButton
              onClick={searchMember}
              class="w-34 h-12 bg-primary1 font-opensans font-600 text-[16px] text-white"
            >
              Search
            </UButton>
          </UInputGroup>
          <span class="font-opensans inline-block mt-2 text-grey3 font-400 text-[12px]">
            Please enter comerid to search and add team member
          </span>
        </div>
        {/* startup team */}
        <div class="team-list mt-10">
          {teamMembers.value.length
            ? teamMembers.value.map(teamMember => (
                <TeamCard v-model:teamMember={teamMember} v-model:teamUpdata={teamUpdata} />
              ))
            : null}
        </div>
        {comerProfile.value ? (
          <TeamModal v-model:show={success.value} teamList={comerProfile.value} />
        ) : null}
      </div>
    )
  }
})

export default TeamSetting
