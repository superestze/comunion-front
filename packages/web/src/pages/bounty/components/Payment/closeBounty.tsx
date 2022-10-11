import { UButton } from '@comunion/components'
import { useDialog } from 'naive-ui'
import { defineComponent, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBountyContractWrapper } from '../../hooks/useBountyContractWrapper'
import useBountyDetail from '../../hooks/useBountyDetail'
import { BasicDialog } from '../Dialog'
import { BOUNTY_STATUS } from '@/constants'
import { services } from '@/services'
export default defineComponent({
  props: {
    detailChainId: {
      type: Number,
      default: () => 0
    },
    bountyContractInfo: {
      type: Object,
      default: () => null
    },
    bountyDetail: {
      type: Object,
      required: true,
      default: () => null
    }
  },
  setup(props) {
    const dialog = useDialog()
    const route = useRoute()
    const visibleFailCloseBounty = ref<boolean>(false)
    const visibleSureCloseBounty = ref<boolean>(false)
    const { bountyContract } = useBountyContractWrapper()
    const bountySection = useBountyDetail(String(route.params.id))

    const bountyContractInfo = computed(() => {
      return props.bountyContractInfo
    })

    const disabled = computed(() => {
      return props.bountyDetail.value.status === BOUNTY_STATUS.COMPLETED
    })

    const closeDesc = computed(() => {
      if (props.bountyDetail.value.status === BOUNTY_STATUS.COMPLETED) {
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
      bountyContractInfo,
      dialog,
      bountySection
    }
  },
  render() {
    const closeBounty = async () => {
      const founderDepositAmount = this.bountyContractInfo.founderDepositAmount
      const applicantDepositAmount = this.bountyContractInfo.applicantDepositAmount
      if (Number(founderDepositAmount) === 0 && Number(applicantDepositAmount) === 0) {
        const sureDialog = this.dialog.warning({
          style: {
            '--n-icon-margin': '20px 4px 0 0'
          },
          title: () => <div class="mt-5 ml-4">Close the bounty?</div>,
          content: () => (
            <div class="mt-6.5 ml-12.5 text-color3">
              The bounty will be closed once you click 'Yes'.
            </div>
          ),
          action: () => (
            <div class="flex mt-10 justify-end">
              <UButton class="mr-16px w-164px" type="default" onClick={() => sureDialog.destroy()}>
                Cancel
              </UButton>
              <UButton
                type="primary"
                class="w-164px"
                size="small"
                onClick={() => closeBountySubmit(sureDialog)}
              >
                Yes
              </UButton>
            </div>
          )
        })
      } else {
        const sureDialog = this.dialog.warning({
          style: {
            '--n-icon-margin': '20px 4px 0 0'
          },
          title: () => <div class="mt-5 ml-4">Failed to close bounty</div>,
          content: () => (
            <div class="mt-6.5 ml-12.5 text-color3">
              The bounty cannot be closed until you release all deposits.
            </div>
          ),
          action: () => (
            <div class="flex mt-10 justify-end">
              <UButton
                type="primary"
                class="w-164px"
                size="small"
                onClick={() => sureDialog.destroy()}
              >
                OK
              </UButton>
            </div>
          )
        })
      }
    }
    const closeBountySubmit = async (dialog: any) => {
      const { error } = await services['bounty@bounty-close']({
        bountyID: this.route.params.id as string
      })
      if (!error) {
        this.bountySection.reload()
        dialog.destroy()
      }
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
          content="The bounty cannot be closed until you release all deposits."
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
