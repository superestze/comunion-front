import { message, UButton, UInput, UInputGroup } from '@comunion/components'
import { defineComponent, ref, reactive } from 'vue'
import { services } from '@/services'
import { StartupItem } from '@/types'

export default defineComponent({
  name: 'addTeamMember',
  props: {
    startupId: {
      type: [Number, String],
      required: true
    },
    group: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const addTeamMemberVisible = ref<boolean>(false)
    const inputWalletAddress = ref<string>('')
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
      inputWalletAddress,
      teamList,
      teamMembers,
      comerProfile,
      propGroup: props.group,
      startupId: props.startupId
    }
  },
  emits: ['triggerNewComer'],
  render() {
    const searchMember = async () => {
      if (this.inputWalletAddress.trim()) {
        const { data } = await services['account@comer-info-get-by-address']({
          address: this.inputWalletAddress
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

        this.inputWalletAddress = ''
        this.$emit('triggerNewComer', data)
      }
      message.info('Please enter the content!')
    }

    return (
      <>
        <div class="mb-6 search">
          <UInputGroup>
            <UInput
              class="h-10 leading-10"
              v-model:value={this.inputWalletAddress}
              size="small"
              placeholder="Search comer by wallet address"
            />
            <UButton onClick={searchMember} type="primary" class="h-10 w-34 u-h4">
              Add
            </UButton>
          </UInputGroup>
        </div>
      </>
    )
  }
})
