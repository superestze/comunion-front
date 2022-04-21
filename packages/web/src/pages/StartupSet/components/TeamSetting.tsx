import { UInput, UInputGroup, UButton } from '@comunion/components'
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
      startupId: props.startup.id,
      comerID: props.startup.comerID
    })
    const searchMember = () => {
      console.log(inputMember.value)
      success.value = true
    }
    const inputMember = ref<string>('')
    // TODO: after backend completed, get data from backend
    const teamMembers = [
      {
        avatar: 'https://comunion-avatars.s3.ap-northeast-1.amazonaws.com/avatar1.svg',
        name: 'Jason Doe',
        role: 'Front-end developer',
        tokenContractAddress: '0x2C5d07aa8188A791CAdC83270A726EECf48B5B11',
        id: 102040386875392,
        comerID: '99804655071232'
      },
      {
        avatar: 'https://comunion-avatars.s3.ap-northeast-1.amazonaws.com/avatar1.svg',
        name: 'Darrell Stew',
        role: 'Front-end developer',
        tokenContractAddress: '0x2C5d07aa8188A791CAdC83270A726EECf48B5B11',
        id: 102040386875392,
        comerID: '99804655071232'
      },
      {
        avatar: 'https://comunion-avatars.s3.ap-northeast-1.amazonaws.com/avatar1.svg',
        name: 'Darrell Stew',
        role: 'Front-end developer',
        tokenContractAddress: '0x2C5d07aa8188A791CAdC83270A726EECf48B5B11',
        id: 102040386875392,
        comerID: '99804655071232'
      }
    ]
    const teamList = async () => {
      const { error, data } = await services['startup@start-team-meabers-list']({
        startupId: paramsList.value.startupId,
        limit: 10,
        offset: 1
      })
      if (!error) {
        console.log(data)
      }
    }
    const teamCreate = async (val: any) => {
      const { error, data } = await services['startup@start-team-meabers-create']({
        startupId: paramsList.value.startupId,
        comerId: paramsList.value.comerID,
        position: val.roles
      })
      if (!error) {
        console.log(data)
        teamList()
      }
    }
    const teamUpdata = async (val: any) => {
      const { error, data } = await services['startup@start-team-meabers-update']({
        startupId: paramsList.value.startupId,
        comerId: paramsList.value.comerID,
        position: val.roles
      })
      if (!error) {
        console.log(data)
        teamList()
      }
    }
    const PARENT_PROVIDE = 'parentProvide'
    provide(PARENT_PROVIDE, root)
    provide(`${PARENT_PROVIDE}/teamCreate`, teamCreate)
    provide(`${PARENT_PROVIDE}/teamUpdata`, teamUpdata)
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
          {teamMembers?.map(teamMember => (
            <TeamCard teamMember={teamMember} v-model:teamUpdata={teamUpdata} />
          ))}
        </div>
        <TeamModal
          v-model:show={success.value}
          teamList={props.startup}
          v-model:teamCreate={teamCreate}
        />
      </div>
    )
  }
})

export default TeamSetting
