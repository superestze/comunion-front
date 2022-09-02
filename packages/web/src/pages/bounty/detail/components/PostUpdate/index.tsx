import { UButton } from '@comunion/components'
import { defineComponent, ref, computed } from 'vue'
import { PostUpdateDialog } from '../Dialog'
import { APPLICANT_STATUS, BOUNTY_STATUS, USER_ROLE } from '@/constants'
import { useBountyContractStore } from '@/stores/bountyContract'

export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      require: true,
      default: () => false
    },
    postUpdate: {
      type: Function,
      require: true,
      default: () => false
    }
  },
  setup() {
    const visible = ref<boolean>(false)
    const bountyContractStore = useBountyContractStore()
    const disabled = computed(() => {
      if (bountyContractStore.bountyContractInfo.bountyStatus < BOUNTY_STATUS.WORKSTARTED) {
        return true
      }
      if (bountyContractStore.bountyContractInfo.role === USER_ROLE.FOUNDER) {
        return false
      }
      return bountyContractStore.bountyContractInfo.status !== APPLICANT_STATUS.APPROVED
    })
    return {
      visible,
      disabled
    }
  },
  render() {
    const triggerDialog = () => {
      this.visible = !this.visible
    }
    return (
      <>
        <PostUpdateDialog
          postUpdate={this.postUpdate}
          visible={this.visible}
          onTriggerDialog={triggerDialog}
        />
        <UButton
          type="primary"
          size="small"
          class="w-120px"
          onClick={triggerDialog}
          disabled={this.disabled}
        >
          Post update
        </UButton>
      </>
    )
  }
})
