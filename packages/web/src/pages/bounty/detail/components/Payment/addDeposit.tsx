import { UButton } from '@comunion/components'
import { defineComponent, ref } from 'vue'
import { AddDepositDialog } from '../Dialog'

export default defineComponent({
  props: {
    disibled: {
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
    return (
      <>
        <AddDepositDialog visible={this.visible} onTriggerDialog={triggerDialog} />
        <UButton class="w-148px mr-25px" ghost disabled={this.disibled} onClick={triggerDialog}>
          + Deposit
        </UButton>
      </>
    )
  }
})
