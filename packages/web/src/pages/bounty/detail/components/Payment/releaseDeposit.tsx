import { UButton } from '@comunion/components'
import { defineComponent, ref } from 'vue'
import { BasicDialog } from '../Dialog'
import { services } from '@/services'

export default defineComponent({
  props: {
    lock: {
      type: Boolean,
      default: () => false
    }
  },
  setup() {
    const visible = ref<boolean>(false)
    return {
      visible
    }
  },
  render() {
    const triggerDialog = () => {
      this.visible = !this.visible
    }
    const handleReleaseDeposit = async () => {
      const { error } = await services['bounty@bounty-founder-release']({
        bountyID: parseInt(this.$route.query.bountyId as string)
      })
      if (!error) {
        triggerDialog()
      }
    }
    return (
      <>
        <BasicDialog
          visible={this.visible}
          title="Release deposit？"
          content=" All deposits will be released."
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
                <UButton type="primary" class="w-164px" size="small" onClick={handleReleaseDeposit}>
                  Yes
                </UButton>
              </div>
            )
          }}
        />
        <UButton class="w-148px" type="primary" disabled={this.lock} onClick={triggerDialog}>
          Release
        </UButton>
      </>
    )
  }
})
