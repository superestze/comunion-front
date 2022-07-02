import './style.css'

import { UInputNumber, UInputNumberPropsType } from '@comunion/components'
import { ArrowDownOutlined, ArrowUpOutlined } from '@comunion/icons'
import { NInputGroup } from 'naive-ui'
import { AllowedComponentProps, defineComponent, PropType } from 'vue'

type GroupType = 'withSelect' | 'withUnit'

const UInputNumberGroup = defineComponent({
  name: 'UInputNumberGroup',
  props: {
    inputProps: {
      type: Object as PropType<UInputNumberPropsType & AllowedComponentProps>
    },
    value: {
      type: Number
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
    const addCurrentValue = () => {
      // currentValue.value = Number(currentValue.value) + props.step
      ctx.emit('update:value', (props.value || 0) + props.step)
    }

    const minusCurrentValue = () => {
      // currentValue.value = Number(currentValue.value) - props.step
      ctx.emit('update:value', (props.value || 0) - props.step)
    }

    const controlSlot = (
      <div class="bg-purple h-6 flex flex-col items-center">
        <ArrowUpOutlined class="w-6 h-6 cursor-pointer" onClick={addCurrentValue} />
        <ArrowDownOutlined class="w-6 h-6 cursor-pointer" onClick={minusCurrentValue} />
      </div>
    )

    const rightPart = () => {
      if (props.type === 'withUnit') {
        return props.renderUnit?.()
      } else if (props.type === 'withSelect') {
        return props.renderSelect?.()
      }
    }
    return () => (
      <div class={['u-input-number-group', props.class]}>
        <NInputGroup>
          <UInputNumber
            v-model:value={props.value}
            showButton={false}
            v-slots={{
              suffix: controlSlot
            }}
            {...props.inputProps}
          />
          {rightPart()}
        </NInputGroup>
      </div>
    )
  }
})

export default UInputNumberGroup
