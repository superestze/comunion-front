import { UButton } from '@comunion/components'
import { defineComponent, ref } from 'vue'
import { ApplyDialog } from '../Dialog'
import { APPLICANT_STATUS } from '@/constants'

export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      default: () => false
    },
    applicantDepositMinAmount: {
      type: Number,
      default: () => 0
    },
    applicantApplyStatus: {
      type: Number,
      required: true
    }
  },
  setup() {
    const applyBountyDialogVisible = ref<boolean>(false)
    return {
      applyBountyDialogVisible
    }
  },
  render() {
    const applyBounty = () => {
      this.applyBountyDialogVisible = !this.applyBountyDialogVisible
    }
    return (
      <>
        <ApplyDialog
          title="Apply"
          visible={this.applyBountyDialogVisible}
          onTriggerDialog={applyBounty}
          deposit={this.applicantDepositMinAmount}
        />
        <UButton
          type="primary"
          class={`w-321px mt-60px mb-48px mx-auto ${this.disabled && 'text-white'}`}
          onClick={applyBounty}
          disabled={this.disabled}
        >
          {this.applicantApplyStatus === APPLICANT_STATUS.APPLIED ? 'Pending' : 'Apply'}
        </UButton>
      </>
    )
  }
})
