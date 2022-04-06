import { UInput, UInputGroup, UButton } from '@comunion/components'
import { defineComponent, ref } from 'vue'
import TeamCard from '@/pages/StartupSet/components/TeamCard'

const TeamSetting = defineComponent({
  name: 'TeamSetting',
  setup(props, ctx) {
    const searchMember = () => {
      console.log(inputMember.value)
    }
    const inputMember = ref<string>('')
    // TODO: after backend completed, get data from backend
    const teamMembers = [
      {
        avatar: 'https://comunion-avatars.s3.ap-northeast-1.amazonaws.com/avatar1.svg',
        name: 'Jason Doe',
        role: 'Front-end developer'
      },
      {
        avatar: 'https://comunion-avatars.s3.ap-northeast-1.amazonaws.com/avatar1.svg',
        name: 'Darrell Stew',
        role: 'Front-end developer'
      },
      {
        avatar: 'https://comunion-avatars.s3.ap-northeast-1.amazonaws.com/avatar1.svg',
        name: 'Darrell Stew',
        role: 'Front-end developer'
      }
    ]

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
            <TeamCard teamMember={teamMember} />
          ))}
        </div>
      </div>
    )
  }
})

export default TeamSetting
