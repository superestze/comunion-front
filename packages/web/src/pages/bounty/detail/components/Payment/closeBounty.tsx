import { UButton } from '@comunion/components'
import { defineComponent, ref } from 'vue'
import { BasicDialog } from '../Dialog'
import { services } from '@/services'

export default defineComponent({
  props: {
    disibled: {
      type: Boolean,
      default: () => false
    }
  },
  setup() {
    const visibleFailCloseBounty = ref<boolean>(false)
    return {
      visibleFailCloseBounty
    }
  },
  render() {
    const closeBounty = async () => {
      const { error } = await services['bounty@bounty-close']({
        bountyID: parseInt(this.$route.query.bountyId as string)
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
              <div class="flex justify-end mt-80px">
                <UButton type="primary" class="w-164px" size="small">
                  Ok
                </UButton>
              </div>
            )
          }}
        />
        <UButton
          ghost
          class="w-321px mt-60px mb-48px mx-auto"
          disabled={this.disibled}
          onClick={closeBounty}
        >
          Close bounty
        </UButton>
      </>
    )
  }
})
