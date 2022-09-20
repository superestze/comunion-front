import { UButton, UTooltip } from '@comunion/components'
import { defineComponent, ref, computed } from 'vue'
import { ApplyDialog } from '../Dialog'
import { APPLICANT_STATUS, BOUNTY_STATUS } from '@/constants'
import { useBountyContractStore } from '@/stores/bountyContract'
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

    const bountyContractStore = useBountyContractStore()

    const ApplicantApplyDesc = computed(() => {
      if (bountyContractStore.bountyContractInfo.bountyStatus === BOUNTY_STATUS.COMPLETED) {
        return 'Completed'
      }
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
        {this.disabled && this.ApplicantApplyDesc === 'Apply' ? (
          <UButton
            type="primary"
            class={`${this.disabled && 'text-white'} ${this.$attrs.class}`}
            onClick={applyBounty}
            disabled={this.disabled}
          >
            <UTooltip
              trigger="hover"
              placement="top"
              v-slots={{
                trigger: () => this.ApplicantApplyDesc,
                default: () => 'This bounty has been won by another applicant'
              }}
            />
          </UButton>
        ) : (
          <UButton
            type="primary"
            class={`${this.disabled && 'text-white'} ${this.$attrs.class}`}
            onClick={applyBounty}
            disabled={this.disabled}
          >
            {this.ApplicantApplyDesc}
          </UButton>
        )}
        {/* <UButton
          type="primary"
          class={`${this.disabled && 'text-white'} ${this.$attrs.class}`}
          onClick={applyBounty}
          disabled={this.disabled}
        >
          {this.ApplicantApplyDesc}
        </UButton> */}
      </>
    )
  }
})
