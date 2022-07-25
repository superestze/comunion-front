import './style.css'

import { NInputGroup } from 'naive-ui'
import { AllowedComponentProps, defineComponent, PropType, watch, ref } from 'vue'
import UInputNumber, { UInputBigNumberPropsType } from '../UInputBigNumber/InputBigNumber'

type GroupType = 'withSelect' | 'withUnit'

const UInputNumberGroup = defineComponent({
  name: 'UInputNumberGroup',
  props: {
    inputProps: {
      type: Object as PropType<UInputBigNumberPropsType & AllowedComponentProps>
    },
    value: {
      type: Object as PropType<string | [string, string] | null>,
      default: null
      // required: true
    },
    class: {
      type: String
    },
    step: {
      type: Number,
      default: 1
    },
    type: {
      type: String as PropType<GroupType>
    },
    renderUnit: {
      type: Function as PropType<() => JSX.Element>
    },
    renderSelect: {
      type: Function as PropType<() => JSX.Element>
    }
  },
  emits: ['update:value'],
  setup(props, ctx) {
    const inputValue = ref(props.value)
    const longEnterEventRef = ref()
    watch(
      () => inputValue.value,
      n => {
        ctx.emit('update:value', n)
      }
    )
    // const addCurrentValue = () => {
    //   inputValue.value = (inputValue.value || 0) + props.step
    //   ctx.emit('update:value', inputValue.value)
    // }

    // const minusCurrentValue = () => {
    //   inputValue.value = (inputValue.value || 0) - props.step
    //   ctx.emit('update:value', inputValue.value)
    // }

    // const longEnterStart = (type: 'up' | 'down') => {
    //   longEnterEnd()
    //   longEnterEventRef.value = setInterval(() => {
    //     if (type === 'up') {
    //       addCurrentValue()
    //     } else {
    //       minusCurrentValue()
    //     }
    //   }, 100)
    // }
    // const longEnterEnd = () => {
    //   clearInterval(longEnterEventRef.value)
    // }

    // const controlSlot = (
    //   <div class="bg-purple w-4.5 h-6 flex flex-col items-center justify-center">
    //     <div
    //       style={{ height: '12px' }}
    //       onMousedown={() => longEnterStart('up')}
    //       onMouseup={longEnterEnd}
    //       onMouseleave={longEnterEnd}
    //     >
    //       <NumberUpOutlined class="cursor-pointer text-grey1 block" onClick={addCurrentValue} />
    //     </div>
    //     <div
    //       style={{ height: '12px' }}
    //       onMousedown={() => longEnterStart('down')}
    //       onMouseup={longEnterEnd}
    //       onMouseleave={longEnterEnd}
    //     >
    //       <NumberDownOutlined class="cursor-pointer text-grey1 block" onClick={minusCurrentValue} />
    //     </div>
    //   </div>
    // )

    const rightPart = () => {
      if (props.type === 'withUnit') {
        return props.renderUnit?.()
      } else if (props.type === 'withSelect') {
        return props.renderSelect?.()
      } else {
        return null
      }
    }
    return () => (
      <div class={['u-input-number-group', props.class]}>
        <NInputGroup>
          <UInputNumber
            v-model:value={inputValue.value as string}
            // showButton={false}
            // v-slots={{
            //   suffix: controlSlot
            // }}
            {...props.inputProps}
          />
          {rightPart()}
        </NInputGroup>
      </div>
    )
  }
})

export { UInputNumberGroup }
