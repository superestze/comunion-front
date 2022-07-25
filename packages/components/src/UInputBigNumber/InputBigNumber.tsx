import { NumberDownOutlined, NumberUpOutlined } from '@comunion/icons'
import Big from 'big.js'
import type { InputProps } from 'naive-ui'
import { NInput } from 'naive-ui'
import { defineComponent, ref, watch } from 'vue'

import './index.css'

export type UInputBigNumberPropsType = InputProps & {
  step?: number
  precision?: number
  max?: string
  min?: string
}

const UInputBigNumber = defineComponent({
  name: 'UInputBigNumber',
  extends: NInput,
  // emits: ['update:value'],
  props: {
    step: {
      type: Number,
      default: 1
    },
    precision: {
      type: Number
    },
    max: {
      type: String
    },
    min: {
      type: String
    }
  },
  setup(props, ctx) {
    const inputValue = ref(props.value)
    const longEnterEventRef = ref()
    watch(
      () => inputValue.value,
      n => {
        if (props.maxlength) {
          inputValue.value = (n as string).substring(0, Number(props.maxlength))
        }
      }
    )
    const blurInput = () => {
      if (inputValue.value) {
        const newValue = new Big(inputValue.value as string)
        formatValue(newValue)
      }
    }
    const formatValue = (newValue: Big) => {
      if (props.precision === undefined) {
        inputValue.value = newValue.toString()
      } else {
        if (newValue.toString().includes('.')) {
          const [intPart, decimalPart] = newValue.toString().split('.')
          inputValue.value = intPart + '.' + decimalPart?.substring(0, props.precision)
        } else {
          inputValue.value = newValue.toString()
        }
      }
      if (props.max && newValue.gt(new Big(props.max))) {
        inputValue.value = props.max
      }
      if (props.min && newValue.lt(new Big(props.min))) {
        inputValue.value = props.min
      }

      ctx.emit('update:value', inputValue.value)
    }
    const addCurrentValue = () => {
      const newValue = new Big((inputValue.value as string) || 0).add(props.step)
      formatValue(newValue)
    }

    const minusCurrentValue = () => {
      const newValue = new Big((inputValue.value as string) || 0).minus(props.step)
      formatValue(newValue)
    }

    const longEnterStart = (type: 'up' | 'down') => {
      longEnterEnd()
      longEnterEventRef.value = setInterval(
        () => {
          if (type === 'up') {
            addCurrentValue()
          } else {
            minusCurrentValue()
          }
        },
        longEnterEventRef.value ? 100 : 300
      )
    }
    const longEnterEnd = () => {
      clearInterval(longEnterEventRef.value)
      longEnterEventRef.value = null
    }
    const controlSlot = (
      <div class="bg-purple w-4.5 h-6 flex flex-col items-center justify-center">
        <div
          style={{ height: '12px' }}
          onMousedown={() => longEnterStart('up')}
          onMouseup={longEnterEnd}
          onMouseleave={longEnterEnd}
        >
          <NumberUpOutlined class="cursor-pointer text-grey1 block" onClick={addCurrentValue} />
        </div>
        <div
          style={{ height: '12px' }}
          onMousedown={() => longEnterStart('down')}
          onMouseup={longEnterEnd}
          onMouseleave={longEnterEnd}
        >
          <NumberDownOutlined class="cursor-pointer text-grey1 block" onClick={minusCurrentValue} />
        </div>
      </div>
    )
    return () => (
      <NInput
        class="input-big-number"
        {...props}
        inputProps={{ ...props.inputProps, type: 'number' }}
        onBlur={blurInput}
        v-model:value={inputValue.value}
        v-slots={{ suffix: controlSlot, ...ctx.slots }}
      ></NInput>
    )
  }
})

export default UInputBigNumber
