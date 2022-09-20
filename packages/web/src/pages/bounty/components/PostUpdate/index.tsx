import { UButton } from '@comunion/components'
import { defineComponent, ref, computed } from 'vue'
import { PostUpdateDialog } from '../Dialog'
import { APPLICANT_STATUS, BOUNTY_STATUS, USER_ROLE } from '@/constants'
import { useBountyContractStore } from '@/stores/bountyContract'

export default defineComponent({
  name: 'PostUpdate',
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
        if (bountyContractStore.bountyContractInfo.bountyStatus >= BOUNTY_STATUS.COMPLETED) {
          return true
        }
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
          class="w-35 !font-primary !font-semibold !text-[14px]"
          onClick={triggerDialog}
          disabled={this.disabled}
          color={this.disabled ? 'rgba(0,0,0,0.1)' : ''}
        >
          Post update
        </UButton>
      </>
    )
  }
})
