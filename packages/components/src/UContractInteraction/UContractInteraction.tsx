import { CloseOutlined } from '@comunion/icons'
import { defineComponent, PropType, ref, watchEffect } from 'vue'
import { UModal } from '../UModal'
import { ExtractPropTypes } from '../utils'

import './UContractInteraction.css'

export type UContractInteractionStatus = 'pending' | 'success' | 'canceled' | 'failed'

export const UContractInteractionProps = {
  status: {
    type: String as PropType<UContractInteractionStatus>
  },
  text: {
    type: String
  }
} as const

export type UContractInteractionPropsType = ExtractPropTypes<typeof UContractInteractionProps>

const UContractInteraction = defineComponent({
  name: 'UContractInteraction',
  props: UContractInteractionProps,
  setup(props) {
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
          <div class={`u-contract-interaction status-${props.status}`}>
            <CloseOutlined class="u-contract-interaction-close" onClick={close} />
            {props.status === 'pending' && <div class="u-contract-interaction-animation"></div>}
            <div class="u-contract-interaction-status">
              {props.status.slice(0, 1).toUpperCase()}
              {props.status.slice(1)}
            </div>
            {props.status === 'pending' && (
              <div class="u-contract-interaction-text">{props.text}</div>
            )}
          </div>
        ) : (
          <div />
        )}
      </UModal>
    )
  }
})

export default UContractInteraction
