import { defineComponent, ref } from 'vue'
import { UTransactionWaiting, UTransactionWaitingPropsType, UButton } from '@/comps/index'

const TransactionWaitingPage = defineComponent({
  name: 'TransactionWaitingPage',
  setup() {
    const status = ref<UTransactionWaitingPropsType['status'] | undefined>()
    return () => (
      <div>
        <div class="flex my-4 gap-4 items-center">
          <UButton type="primary" onClick={() => (status.value = 'pending')}>
            Pending
          </UButton>
          <UButton type="primary" onClick={() => (status.value = 'success')}>
            Success
          </UButton>
          <UButton type="primary" onClick={() => (status.value = 'failed')}>
            Failed
          </UButton>
        </div>
        <UTransactionWaiting text="Startup" hash="0xxxxx" status={status.value} />
      </div>
    )
  }
})

export default TransactionWaitingPage
