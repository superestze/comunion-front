import { defineComponent } from 'vue'
import { UTransactionWaiting } from '@/comps/UTransactionWaiting'

const TransactionWaitingPage = defineComponent({
  name: 'TransactionWaitingPage',
  setup() {
    return () => <UTransactionWaiting text="Startup" hash="0xxxxx" status="pending" />
  }
})

export default TransactionWaitingPage
