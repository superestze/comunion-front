import { UButton } from '@comunion/components'
import { defineComponent, ref } from 'vue'
import { BasicDialog } from '../Dialog'

export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      require: true
    }
  },
  setup() {
    const visible = ref<boolean>(false)
    return {
      visible
    }
  },
  render() {
    const releaseMyDeposit = () => {
      // services['bounty@bounty']()
    }
    const triggerDialog = () => {
      this.visible = !this.visible
    }
    return (
      <>
        <BasicDialog
          visible={this.visible}
          title="Release your deposits ？"
          content="All deposits will be returned to your wallet after releaseing, and your application will be canceled."
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
                <UButton type="primary" class="w-164px" size="small" onClick={releaseMyDeposit}>
                  Yes
                </UButton>
              </div>
            )
          }}
        />
        <UButton
          type={this.disabled ? 'tertiary' : 'primary'}
          class="w-321px mt-60px mb-48px mx-auto"
          onClick={triggerDialog}
          disabled={this.disabled}
        >
          Release my deposit
        </UButton>
      </>
    )
  }
})
