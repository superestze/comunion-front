import { UButton } from '@comunion/components'
import { defineComponent, ref } from 'vue'
import { ApplyDialog } from '../Dialog'

export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      default: () => false
    },
    applicantDeposit: {
      type: Number,
      default: () => 0
    },
    applicantApplyStatus: {
      type: Number,
      require: true
    }
  },
  setup() {
    const applyBountyDialogVisible = ref<boolean>(false)
    return {
      applyBountyDialogVisible
    }
  },
  render() {
    const applyBounty = (done?: boolean | MouseEvent) => {
      if (typeof done === 'boolean' && done) {
        // this.mode = 'applyed'
      }
      this.applyBountyDialogVisible = !this.applyBountyDialogVisible
    }
    return (
      <>
        <ApplyDialog
          title="Apply"
          visible={this.applyBountyDialogVisible}
          onTriggerDialog={applyBounty}
          deposit={this.applicantDeposit}
        />
        <UButton
          type="primary"
          class="w-321px mt-60px mb-48px mx-auto"
          onClick={applyBounty}
          disabled={this.disabled}
        >
          {this.applicantApplyStatus === 0 ? 'Pending' : 'Apply'}
        </UButton>
      </>
    )
  }
})
