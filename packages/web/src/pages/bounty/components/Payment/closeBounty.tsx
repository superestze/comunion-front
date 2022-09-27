import { UButton } from '@comunion/components'
import { defineComponent, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBountyContractWrapper } from '../../hooks/useBountyContractWrapper'
import { BasicDialog } from '../Dialog'
import { BOUNTY_STATUS } from '@/constants'
import { services } from '@/services'
import { useBountyContractStore } from '@/stores/bountyContract'
import { checkSupportNetwork } from '@/utils/wallet'

export default defineComponent({
  props: {
    detailChainId: {
      type: Number,
      default: () => 0
    }
  },
  setup() {
    const route = useRoute()
    const visibleFailCloseBounty = ref<boolean>(false)
    const { bountyContract } = useBountyContractWrapper()
    const bountyContractStore = useBountyContractStore()

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
      close: bountyContract.close,
      disabled,
      closeDesc,
      route
    }
  },
  render() {
    const closeBounty = async () => {
      const isSupport = await checkSupportNetwork(this.detailChainId)
      if (!isSupport) {
        return
      }
      // TODO confirm dialog
      // await this.close(
      //   'Waiting to submit all contents to blockchain for close bounty',
      //   'Close bounty succeedes'
      // )
      await this.close('', '')
      const { error } = await services['bounty@bounty-close']({
        bountyID: this.route.params.id as string
      })
      if (error) {
        triggerDialog()
      }
    }
    const triggerDialog = () => {
      this.visibleFailCloseBounty = !this.visibleFailCloseBounty
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
                <UButton type="primary" class="w-164px" size="small">
                  Ok
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
