import { UButton } from '@comunion/components'
import { defineComponent, ref, computed } from 'vue'
import { ApplyDialog } from '../Dialog'
import { APPLICANT_STATUS } from '@/constants'
import { checkSupportNetwork } from '@/utils/wallet'

export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      default: () => false
    },
    detailChainId: {
      type: Number,
      default: () => 0
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
  setup(props) {
    const applyBountyDialogVisible = ref<boolean>(false)

    // const bountyContractStore = useBountyContractStore()

    const ApplicantApplyDesc = computed(() => {
      switch (true) {
        case props.applicantApplyStatus === APPLICANT_STATUS.APPLIED:
          return 'Awaiting approval'

        case props.applicantApplyStatus === APPLICANT_STATUS.APPROVED:
          return 'Started working'
        default:
          return 'Apply'
      }
    })
    return {
      applyBountyDialogVisible,
      ApplicantApplyDesc
    }
  },
  render() {
    const applyBounty = async () => {
      const isSupport = await checkSupportNetwork(this.detailChainId)
      if (isSupport) {
        this.applyBountyDialogVisible = !this.applyBountyDialogVisible
      }
    }
    return (
      <>
        <ApplyDialog
          title="Apply"
          detailChainId={this.detailChainId}
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
          {this.ApplicantApplyDesc}
        </UButton>
      </>
    )
  }
})
