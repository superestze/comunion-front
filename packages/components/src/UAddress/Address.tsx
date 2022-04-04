import { CopyOutlined } from '@comunion/icons'
import copy from 'copy-to-clipboard'
import { defineComponent, toRefs, ref } from 'vue'
import { UTooltip } from '../UTooltip'
import { ExtractPropTypes } from '../utils'

import './address.css'

export const UAddressProps = {
  prefixLength: {
    type: Number,
    default: 8
  },
  suffixLength: {
    type: Number,
    default: 10
  },
  autoSlice: {
    type: Boolean,
    default: false
  },
  address: {
    type: String,
    required: true
  }
} as const

export type UAddressPropsType = ExtractPropTypes<typeof UAddressProps>

const UAddress = defineComponent({
  name: 'UAddress',
  props: UAddressProps,
  setup(props, { attrs }) {
    const showTooltipRef = ref<boolean>(false)

    const { address, autoSlice, prefixLength, suffixLength } = toRefs(props)

    return () => {
      let addressVal = address.value
      if (!addressVal) {
        return ''
      }

      if (autoSlice.value) {
        const len = address.value.length || 0
        addressVal = address.value.replace(/[A-Za-z0-9]/gi, (c: string, i) => {
          if (i > prefixLength.value && i < len - suffixLength.value) {
            return '*'
          }

          return c
        })
      }

      return (
        <div class={`u-address ${attrs?.class || ''}`}>
          <span class="u-address__link">
            <a target="_blank" href={`https://cn.etherscan.com/tx/${address.value}`}>
              {addressVal}
            </a>
          </span>
          <span
            class="u-address__copy"
            onClick={e => {
              e.stopPropagation()
              showTooltipRef.value = copy(address.value)
            }}
            onMouseleave={e => {
              e.stopPropagation()
              showTooltipRef.value = false
            }}
          >
            <UTooltip show={showTooltipRef.value}>
              {{
                trigger: () => <CopyOutlined class="u-address__icon" />,
                default: () => 'Copied!'
              }}
            </UTooltip>
          </span>
        </div>
      )
    }
  }
})

export default UAddress
