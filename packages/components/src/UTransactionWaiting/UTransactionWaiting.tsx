import { CheckedFilled, CloseOutlined } from '@comunion/icons'
import { defineComponent, PropType } from 'vue'
import { ExtractPropTypes } from '../utils'

export const UTransactionWaitingProps = {
  text: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  status: {
    type: String as PropType<'pending' | 'success' | 'failed'>,
    required: true,
    default: 'pending'
  }
} as const

export type UTransactionWaitingPropsType = ExtractPropTypes<typeof UTransactionWaitingProps>

const UTransactionWaiting = defineComponent({
  name: 'UTransactionWaiting',
  props: UTransactionWaitingProps,
  setup(props) {
    return () => (
      <div class="u-transaction-waiting">
        <CloseOutlined class="u-transaction-waiting-close" />
        <CheckedFilled class="u-transaction-waiting-checked" />
        <div>
          <div class="u-transaction-waiting-text">{props.text}</div>
          <a
            class="u-transaction-waiting-link"
            href={`https://goerli.etherscan.io/tx/${props.hash}`}
          >
            View on Etherscan
          </a>
        </div>
        <div class="u-transaction-waiting-bar"></div>
      </div>
    )
  }
})

export default UTransactionWaiting
