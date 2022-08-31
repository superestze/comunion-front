import { UButton } from '@comunion/components'
import { defineComponent, ref, computed } from 'vue'
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
    const visible = ref<boolean>(false)
    const bountyContractStore = useBountyContractStore()
    const { bountyContract, gap } = useBountyContractWrapper()
    const { lock, unlock } = bountyContract
    const depositLock = computed(() => bountyContractStore.bountyContractInfo.depositLock)
    const isCompleted = computed(
      () => bountyContractStore.bountyContractInfo.bountyStatus >= BOUNTY_STATUS.COMPLETED
    )
    return {
      visible,
      lock,
      unlock,
      depositLock,
      gap,
      isCompleted
    }
  },
  render() {
    const triggerDialog = () => {
      this.visible = !this.visible
    }
    const handleUnLockDeposit = async () => {
      const isSupport = await checkSupportNetwork(this.detailChainId)
      if (!isSupport) {
        return
      }
      await this.unlock('', '')
      const { error } = await services['bounty@bounty-applicants-unlock']({
        bountyID: parseInt(this.$route.query.bountyId as string)
      })
      if (!error) {
        triggerDialog()
      }
    }

    const handleLockDeposit = async () => {
      const isSupport = await checkSupportNetwork(this.detailChainId)
      if (!isSupport) {
        return
      }
      // if (this.gap < 0) {
      //   return
      // }
      await this.lock('', '')
      services['bounty@bounty-applicant-lock']({
        bountyID: parseInt(this.$route.query.bountyId as string)
      })
    }
    return (
      <>
        <BasicDialog
          visible={this.visible}
          title="Unlock the deposits ？"
          content="It is recommended that you unlock the deposit after completing the bounty."
          onTriggerDialog={triggerDialog}
          v-slots={{
            btns: () => (
              <div class="flex justify-end mt-80px">
                <UButton
                  type="default"
                  class="w-164px mr-16px"
                  size="small"
                  onClick={triggerDialog}
                >
                  Cancel
                </UButton>
                <UButton type="primary" class="w-164px" size="small" onClick={handleUnLockDeposit}>
                  Submit
                </UButton>
              </div>
            )
          }}
        />
        {this.depositLock ? (
          <UButton
            disabled={this.isCompleted}
            type="primary"
            class="w-321px mt-60px mb-48px mx-auto"
            onClick={triggerDialog}
          >
            UnLock
          </UButton>
        ) : (
          <UButton
            disabled={this.isCompleted}
            type="primary"
            class="w-321px mt-60px mb-48px mx-auto"
            onClick={handleLockDeposit}
          >
            Lock
          </UButton>
        )}
      </>
    )
  }
})
