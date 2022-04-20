import { defineComponent, ref } from 'vue'
import { UButton, UTransaction, UTransactionPropsType } from '@/comps/index'

const TransactionDemoPage = defineComponent({
  name: 'TransactionDemoPage',
  setup() {
    const status = ref<UTransactionPropsType['status']>()

    const testStatus = (_status: UTransactionPropsType['status']) => {
      status.value = 'pending'
      setTimeout(() => {
        status.value = _status
      }, 3000)
    }

    return () => (
      <>
        <UTransaction
          status={status.value}
          text="Waiting to submit all contents to blockchain for creating startup"
        />
        <div class="flex items-center gap-4">
          <UButton onClick={() => (status.value = 'pending')}>Pending</UButton>
          <UButton onClick={() => testStatus('success')}>Success</UButton>
          <UButton onClick={() => testStatus('canceled')}>Cancel</UButton>
          <UButton onClick={() => testStatus('failed')}>Fail</UButton>
        </div>
      </>
    )
  }
})

export default TransactionDemoPage
