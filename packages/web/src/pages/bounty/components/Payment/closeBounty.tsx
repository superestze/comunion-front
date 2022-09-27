import { UButton } from '@comunion/components'
import { defineComponent, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBountyContractWrapper } from '../../hooks/useBountyContractWrapper'
import { BasicDialog } from '../Dialog'
import { BOUNTY_STATUS } from '@/constants'
import { services } from '@/services'
import { useBountyContractStore } from '@/stores/bountyContract'

export default defineComponent({
  props: {
    detailChainId: {
      type: Number,
      default: () => 0
    },
    bountyContractInfo: {
      type: Object,
      default: () => null
    }
  },
  setup(props) {
    const route = useRoute()
    const visibleFailCloseBounty = ref<boolean>(false)
    const visibleSureCloseBounty = ref<boolean>(false)
    const { bountyContract } = useBountyContractWrapper()
    const bountyContractStore = useBountyContractStore()
    const bountyContractInfo = computed(() => {
      return props.bountyContractInfo
    })
    console.log(bountyContractInfo.value)
    const disabled = computed(() => {
      return bountyContractStore.bountyContractInfo.bountyStatus === BOUNTY_STATUS.COMPLETED
    })

    const closeDesc = computed(() => {
      if (bountyContractStore.bountyContractInfo.bountyStatus === BOUNTY_STATUS.COMPLETED) {
        return 'Completed'
      } else {
        return 'Close bounty'
      }
    })
    return {
      visibleFailCloseBounty,
      visibleSureCloseBounty,
      close: bountyContract.close,
      disabled,
      closeDesc,
      route,
      bountyContractInfo
    }
  },
  render() {
    const closeBounty = async () => {
      const founderDepositAmount = this.bountyContractInfo.founderDepositAmount
      const applicantDepositAmount = this.bountyContractInfo.applicantDepositMinAmount
      // Number(founderDepositAmount) === 0 && Number(applicantDepositAmount) === 0
      if (Number(founderDepositAmount) === 0 && Number(applicantDepositAmount) === 0) {
        triggerSureDialog()
      } else {
        triggerDialog()
      }
    }
    const closeBountySubmit = async () => {
      const { error } = await services['bounty@bounty-close']({
        bountyID: this.route.params.id as string
      })
      if (error) {
        triggerDialog()
      }
      triggerSureDialog()
    }
    const triggerDialog = () => {
      this.visibleFailCloseBounty = !this.visibleFailCloseBounty
    }
    const triggerSureDialog = () => {
      this.visibleSureCloseBounty = !this.visibleSureCloseBounty
    }
    return (
      <>
        <BasicDialog
          visible={this.visibleFailCloseBounty}
          title="Failed to close bounty"
          content="You need release all deposits before do close bounty"
          onTriggerDialog={triggerDialog}
          v-slots={{
            btns: () => (
              <div class="flex mt-10 justify-end">
                <UButton type="primary" class="w-164px" size="small" onClick={triggerDialog}>
                  Yes
                </UButton>
              </div>
            )
          }}
        />
        <BasicDialog
          visible={this.visibleSureCloseBounty}
          title="Are you sure to close the bounty？"
          content="Bounty will be closed once you click yes button"
          onTriggerDialog={triggerSureDialog}
          v-slots={{
            btns: () => (
              <div class="flex mt-10 justify-end">
                <UButton class="mr-16px w-164px" type="default" onClick={triggerSureDialog}>
                  cancel
                </UButton>
                <UButton type="primary" class="w-164px" size="small" onClick={closeBountySubmit}>
                  Yes
                </UButton>
              </div>
            )
          }}
        />
        <UButton
          ghost
          class={`${this.$attrs.class}`}
          disabled={this.disabled}
          onClick={closeBounty}
          size="small"
        >
          {this.closeDesc}
        </UButton>
      </>
    )
  }
})
