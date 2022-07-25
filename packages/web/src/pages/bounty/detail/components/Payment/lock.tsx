import { UButton } from '@comunion/components'
import { defineComponent, ref } from 'vue'
import { BasicDialog } from '../Dialog'
import { services } from '@/services'
import { useBountyStore } from '@/stores'

export default defineComponent({
  props: {
    lock: {
      type: Boolean,
      default: () => false
    }
  },
  setup() {
    const visible = ref<boolean>(false)
    const bounty = useBountyStore()
    const { getBountyStatus } = bounty
    return {
      visible,
      getBountyStatus
    }
  },
  render() {
    const triggerDialog = () => {
      this.visible = !this.visible
    }
    const handleUnLockDeposit = async () => {
      const { error } = await services['bounty@bounty-applicants-unlock']({
        bountyID: parseInt(this.$route.query.bountyId as string)
      })
      if (!error) {
        this.getBountyStatus(this.$route.query.bountyId as string)
        triggerDialog()
      }
    }

    const handleLockDeposit = async () => {
      const { error } = await services['bounty@bounty-applicant-lock']({
        bountyID: parseInt(this.$route.query.bountyId as string)
      })
      if (!error) {
        this.getBountyStatus(this.$route.query.bountyId as string)
      }
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
        {this.lock ? (
          <UButton type="primary" class="w-321px mt-60px mb-48px mx-auto" onClick={triggerDialog}>
            UnLock
          </UButton>
        ) : (
          <UButton
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
