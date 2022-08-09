import { message, UButton, UInput, UInputGroup } from '@comunion/components'
import { defineComponent, ref, reactive } from 'vue'
import AddTeamMemberDialog from './addTeamMemberDialog'
import { services } from '@/services'
import { StartupItem } from '@/types'

export default defineComponent({
  props: {
    startupId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const addTeamMemberVisible = ref<boolean>(false)
    const walletAddress = ref<string>('')
    const teamMembers = ref<StartupItem[]>([])
    const comerProfile = reactive<any>(null)
    const teamList = async () => {
      const { data } = await services['startup@start-team-meabers-list']({
        startupId: props.startupId,
        limit: 99,
        offset: 0
      })
      if (data!.list.length) {
        teamMembers.value = data!.list as unknown as StartupItem[]
      }
    }
    return {
      addTeamMemberVisible,
      walletAddress,
      teamList,
      teamMembers,
      comerProfile
    }
  },
  render() {
    const handleSettingDialog = () => {
      this.addTeamMemberVisible = !this.addTeamMemberVisible
    }
    const searchMember = async () => {
      if (this.walletAddress.trim()) {
        const { data } = await services['account@comer-info-get-by-address']({
          address: this.walletAddress
        })
        if (!data) {
          message.error('Search no results!')
          return
        }
        await this.teamList()
        const filterData = this.teamMembers.filter(
          item => item!.comerID === data.comerProfile!.comerID
        )
        if (filterData.length) {
          message.error('Already exists!')
          return
        }

        this.comerProfile = data
        handleSettingDialog()
        return
      }
      message.info('Please enter the content!')
    }
    return (
      <>
        <div class="search mt-10 mb-6 h-10">
          <UInputGroup>
            <UInput class="h-12 leading-12" v-model:value={this.walletAddress} size="small" />
            <UButton
              onClick={searchMember}
              size="small"
              class="w-34 h-12 bg-primary1 font-opensans font-600 text-[16px] text-white"
            >
              Add
            </UButton>
          </UInputGroup>
        </div>
        <AddTeamMemberDialog
          comer={this.comerProfile}
          visible={this.addTeamMemberVisible}
          onTriggerDialog={handleSettingDialog}
        />
      </>
    )
  }
})
