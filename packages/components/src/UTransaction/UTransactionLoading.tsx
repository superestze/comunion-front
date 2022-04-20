import { CloseOutlined } from '@comunion/icons'
import { defineComponent, PropType, ref, watchEffect } from 'vue'
import { UModal } from '../UModal'
import { ExtractPropTypes } from '../utils'

import './UTransaction.css'

export const UTransactionProps = {
  status: {
    type: String as PropType<'pending' | 'success' | 'canceled' | 'failed'>
  },
  text: {
    type: String
  }
} as const

export type UTransactionPropsType = ExtractPropTypes<typeof UTransactionProps>

const UTransaction = defineComponent({
  name: 'UTransaction',
  props: UTransactionProps,
  setup(props, ctx) {
    const show = ref(false)

    const close = () => {
      show.value = false
    }

    watchEffect(() => {
      if (props.status) {
        if (['success', 'canceled', 'failed'].includes(props.status)) {
          setTimeout(() => {
            show.value = false
          }, 1000)
        } else if ('pending' === props.status) {
          show.value = true
        }
      }
    })

    return () => (
      <UModal v-model:show={show.value} transform-origin="center">
        {props.status && show.value ? (
          <div class={`u-transaction status-${props.status}`}>
            <CloseOutlined class="u-transaction-close" onClick={close} />
            {props.status === 'pending' && <div class="u-transaction-animation"></div>}
            <div class="u-transaction-status">
              {props.status.slice(0, 1).toUpperCase()}
              {props.status.slice(1)}
            </div>
            {props.status === 'pending' && <div class="u-transaction-text">{props.text}</div>}
          </div>
        ) : (
          <div />
        )}
      </UModal>
    )
  }
})

export default UTransaction
